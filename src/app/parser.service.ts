import { Injectable } from '@angular/core';
import { IfThenElseBlock, RepeatBlock, UIBlock } from './classes/UIBlock';
import { FieldType, NavButtonOptions } from './classes/interfaces';
import {
  CheckboxElement, DropDownElement, ErrorElement,
  MultiChoiceElement, NavButtonGroupElement, NumberInputElement, TextElement,
  TextInputElement, UIElement
} from './classes/UIElement';
import { environment } from '../environments/environment';

type IfStackObjectKey = 'isTrueBranch' | 'uiBlock';
type IfElementCompoundObject = Record<IfStackObjectKey, UIBlock | boolean>; // holds IfBlock and true/false branch state

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  private rootBlock: UIBlock;
  private scriptLines: string[] = [];
  private _idCounter = 0;

  // add parsed elements to last opened block
  private openBlocks: Array<IfElementCompoundObject | RepeatBlock> = [];

  get idCounter(): string {
    this._idCounter += 1;
    return this._idCounter.toString();
  }

  parseUnitDefinition(scriptLines: string[]): UIBlock {
    this.rootBlock = new UIBlock();
    const errorMessage = ParserService.checkScriptHeader(scriptLines[0]);
    if (errorMessage !== '') {
      this.rootBlock.elements.push(ParserService.createErrorElement(errorMessage));
    } else {
      scriptLines.splice(0, 1);
      this.scriptLines = scriptLines;
      this.parseScriptLines();
    }
    return this.rootBlock;
  }

  private static checkScriptHeader(headerLine: string): string {
    const scriptKeyword = ParserService.getKeyword(headerLine);
    if (scriptKeyword === '') {
      return 'Scriptfehler: Kein Keyword gefunden!';
    }
    if (scriptKeyword !== 'iqb-scripted') {
      return 'Scriptfehler: Typ muss iqb-scripted sein!';
    }
    const versionString = ParserService.getParameter(headerLine, 1);
    if (!versionString) {
      return 'Scriptfehler: Kein Version-Parameter gefunden!';
    }
    const versionNumbers = versionString.match(/\d+/g);
    if (!versionNumbers || versionNumbers.length < 2) {
      return 'Scriptfehler: Version-Parameter Fehlerhaft!';
    }
    return ParserService.checkMajorVersion(Number(versionNumbers[0]));
  }

  private static checkMajorVersion(majorVersion: number): string {
    const supportedMajorVersions = environment.supportedScriptMajorVersions;
    if (!supportedMajorVersions.includes(majorVersion)) {
      return `Scriptfehler: Scriptversion nicht unterstützt (erste Zeile)!\
Unterstützte Versionen: ${supportedMajorVersions}`;
    }
    return '';
  }

  /**
   * Return first word of the line or empty string.
   * @param line to check
   */
  private static getKeyword(line: string): string {
    const keywordList = line.match(/[a-z-]+/);
    return keywordList ? keywordList[0] : '';
  }

  private static getParameter(line: string, pos: number): string {
    const lineSplits = line.split('??');
    const lineSplits2 = lineSplits[0].split('::');
    return lineSplits2[pos];
  }

  private static getHelpText(line: string): string {
    const lineSplits = line.split('??');
    if (lineSplits.length > 1) {
      return lineSplits[1];
    }
    return null;
  }

  // TODO basic error check: same amount of start and ends for example, fehlende parameter
  // TODO remove rem lines
  // private parseScriptLines(storedResponses: Record<string, string>): void {
  private parseScriptLines(): void {
    this.scriptLines.forEach(line => {
      let elementToAdd: UIElement | UIBlock = null;
      if (line.trim() === '') {
        elementToAdd = new UIElement(FieldType.TEXT);
      } else if (ParserService.getKeyword(line) === 'rem') {
        return;
      } else if (ParserService.getKeyword(line) === 'if-start') { // createIfBlock and add to stack
        const ifElseBlock = ParserService.createIfElseBlock(line);

        if (ifElseBlock instanceof UIElement) { // error case
          elementToAdd = ifElseBlock;
        } else {
          this.openBlocks.push({
            isTrueBranch: true,
            uiBlock: ifElseBlock
          });
        }
      } else if (ParserService.getKeyword(line) === 'if-else') { // switch to true branch of last object
        (this.openBlocks[this.openBlocks.length - 1] as Record<IfStackObjectKey, UIBlock | boolean>).isTrueBranch =
          false;
      } else if (ParserService.getKeyword(line) === 'if-end') { // remove last object and mark for adding
        elementToAdd =
          (this.openBlocks.pop() as Record<IfStackObjectKey, UIBlock | boolean>).uiBlock as unknown as UIBlock;
      } else if (ParserService.getKeyword(line) === 'repeat-start') {
        const repeatBlockElement = ParserService.createRepeatBlock(line);
        if (repeatBlockElement instanceof UIElement) {
          elementToAdd = repeatBlockElement;
        } else {
          this.openBlocks.push(repeatBlockElement);
        }
      } else if (ParserService.getKeyword(line) === 'repeat-end') {
        elementToAdd = this.openBlocks.pop() as RepeatBlock;
      } else {
        elementToAdd = ParserService.parseElement(line, this.idCounter);
      }

      if (elementToAdd) {
        if (this.openBlocks.length > 0) {
          const latestBlock = this.openBlocks[this.openBlocks.length - 1];
          if (latestBlock instanceof RepeatBlock) {
            latestBlock.templateElements.push(elementToAdd);
          } else if (latestBlock.isTrueBranch) {
            (latestBlock.uiBlock as IfThenElseBlock).trueElements.push(elementToAdd);
          } else {
            (latestBlock.uiBlock as IfThenElseBlock).falseElements.push(elementToAdd);
          }
        } else {
          this.rootBlock.elements.push(elementToAdd);
        }
      }
    });
  }

  private static parseElement(line: string, id): UIElement {
    const keyword = ParserService.getKeyword(line);
    switch (keyword) {
      case 'text': // falls through
      case 'header': // falls through
      case 'title': // falls through
      case 'html':
        return ParserService.createTextElement(line);
      case 'hr':
        return new UIElement(FieldType.HR);
      case 'input-text':
        return ParserService.createTextInputElement(line, id);
      case 'input-number':
        return ParserService.createNumberInputElement(line, id);
      case 'checkbox':
        return ParserService.createCheckboxElement(line, id);
      case 'multiple-choice':
        return ParserService.createMultiChoiceElement(line, id);
      case 'drop-down':
        return ParserService.createDropDownElement(line, id);
      case 'nav-button-group':
        return ParserService.createNavButtonGroupElement(line);
      default:
        return ParserService.createErrorElement(`Scriptfehler - Schlüsselwort nicht erkannt: "${line}"`);
    }
  }

  private static createTextElement(line): UIElement {
    const textParam = this.getParameter(line, 1);
    if (!textParam) {
      return new UIElement(FieldType.TEXT);
    }

    const capitalizedKeyword = this.getKeyword(line).toUpperCase().replace(/[-]/g, '_');
    const fieldType = FieldType[capitalizedKeyword];
    return new TextElement(fieldType, textParam, this.getHelpText(line));
  }

  private static createTextInputElement(line, id): UIElement {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    const maxLines = this.getParameter(line, 5);
    const maxLength = this.getParameter(line, 6);
    return new TextInputElement(id, variableParam, required, textBefore, textAfter, maxLines, maxLength,
      this.getHelpText(line));
  }

  private static createNumberInputElement(line, id): UIElement {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    const minValue = this.getParameter(line, 5);
    const maxValue = this.getParameter(line, 6);
    return new NumberInputElement(id, variableParam, required, textBefore, textAfter, minValue, maxValue,
      this.getHelpText(line));
  }

  private static createCheckboxElement(line: string, id: string) {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    return new CheckboxElement(id, variableParam, required, textBefore, textAfter, this.getHelpText(line));
  }

  private static createMultiChoiceElement(line: string, id: string): UIElement {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    return new MultiChoiceElement(id, variableParam, required, textBefore, textAfter, this.getHelpText(line));
  }

  private static createDropDownElement(line: string, id: string) {
    const variableParam = this.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    const required = (this.getParameter(line, 2) && this.getParameter(line, 2) === '1');
    const textBefore = this.getParameter(line, 3);
    const textAfter = this.getParameter(line, 4);
    return new DropDownElement(id, variableParam, required, textBefore, textAfter, this.getHelpText(line));
  }

  private static createNavButtonGroupElement(line): UIElement {
    const options = this.getParameter(line, 1);
    const optionList = options.split('##');
    if (optionList.length < 1 || (optionList.length === 1 && optionList[0] === '')) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    for (const option of optionList) {
      if (!Object.values(NavButtonOptions).includes(option)) {
        return ParserService.createErrorElement(
          `Scriptfehler - Unbekannter Parameter: "${option}"`
        );
      }
    }
    return new NavButtonGroupElement(options);
  }

  private static createErrorElement(errorText: string): UIElement {
    return new ErrorElement(errorText);
  }

  private static createIfElseBlock(line): UIElement | UIBlock {
    const variableParam = ParserService.getParameter(line, 1);
    const valueParam = ParserService.getParameter(line, 2);
    if (!variableParam || !valueParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }
    return new IfThenElseBlock(variableParam, valueParam);
  }

  private static createRepeatBlock(line): UIElement | RepeatBlock {
    const variableParam = ParserService.getParameter(line, 1);
    if (!variableParam) {
      return ParserService.createErrorElement(
        `Scriptfehler - Parameter fehlt: "${line}"`
      );
    }

    const textBefore = this.getParameter(line, 2);
    const textAfter = this.getParameter(line, 3);
    const maxBlocks = this.getParameter(line, 4);
    return new RepeatBlock(variableParam, textBefore, textAfter, maxBlocks, ParserService.getHelpText(line));
  }
}
