import { TestBed } from '@angular/core/testing';
import { ParserService } from './parser.service';
import {
  CheckboxElement,
  DropDownElement, MultiChoiceElement,
  NumberInputElement,
  TextElement,
  TextInputElement,
  UIElement
} from './classes/UIElement';
import { PropertyKey } from './classes/interfaces';
import { IfThenElseBlock, RepeatBlock } from "./classes/UIBlock";

describe('DataService', () => {
  let dataService: ParserService;
  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    dataService = TestBed.inject(ParserService);
  });

  it('should check input script header for validity and accepted version', () => {
    dataService.setElements(['iqb-scripted::1.0'], {});
    expect(dataService.rootBlock.elements.length).toEqual(0);

    let errorText = '';
    dataService.setElements([''], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Keyword gefunden!');

    dataService.setElements(['bla'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Typ muss iqb-scripted sein!');

    dataService.setElements(['iqb-scripted'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Version-Parameter gefunden!');

    dataService.setElements(['iqb-scripted::aa'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    dataService.setElements(['iqb-scripted::1.a'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    dataService.setElements(['iqb-scripted::a.1'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');

    dataService.setElements(['iqb-scripted::0.1'], {});
    errorText = (dataService.rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Scriptversion nicht unterstützt (erste Zeile)!' +
                              'Unterstützte Versionen: 1');
  });

  it('should create text elements', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'title::Testscript Title??Hilfetext1\n' +
      'header::Abschnitt 1 Basic Elements??Hilfetext2\n' +
      'header\n' +
      'text::Standard Text Element??Hilfetext1\n' +
      '\n' +
      'text::Standard Text Element2\n' +
      'html::HTML Ele <strong>strong</strong> and hyperlink: <a href=”https://www.iqb.hu-berlin.de”>IQB website</a>';
    dataService.setElements(testScript.split('\n'), {});
    //
    // console.log(dataService.rootBlock.elements);

    expect(dataService.rootBlock.elements.length).toEqual(7);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        text: 'Testscript Title',
        helpText: 'Hilfetext1',
        fieldType: 2
      } as unknown as TextElement
    ));
    expect(dataService.rootBlock.elements[1]).toEqual(jasmine.objectContaining(
      {
        text: 'Abschnitt 1 Basic Elements',
        helpText: 'Hilfetext2',
        fieldType: 1
      } as unknown as TextElement
    ));
    expect(dataService.rootBlock.elements[2]).toEqual(jasmine.objectContaining(
      { fieldType: 0 } as TextElement
    ));
    expect(dataService.rootBlock.elements[3]).toEqual(jasmine.objectContaining(
      {
        text: 'Standard Text Element',
        helpText: 'Hilfetext1',
        fieldType: 0
      } as unknown as TextElement
    ));
    expect(dataService.rootBlock.elements[4]).toEqual(jasmine.objectContaining(
      { fieldType: 0 } as TextElement
    ));
    expect(dataService.rootBlock.elements[5]).toEqual(jasmine.objectContaining(
      {
        text: 'Standard Text Element2',
        helpText: null,
        fieldType: 0
      } as unknown as TextElement
    ));
    expect(dataService.rootBlock.elements[6]).toEqual(jasmine.objectContaining(
      {
        text: 'HTML Ele <strong>strong</strong> and hyperlink: <a href=”https://www.iqb.hu-berlin.de”>IQB website</a>',
        helpText: null,
        fieldType: 5
      } as unknown as TextElement
    ));
  });

  it('should create input elements', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'input-text::text_var1::1::Text eingeben::Text nach Feld::0::10??Hilfetextxy\n' +
      'input-number::num_var1::0::Nummer eingeben::Text nach Feld::0::10??Hilfetext1\n' +
      'checkbox::check_var1::0::Bitte ankreuzen\n' +
      'multiple-choice::mc_var1::1::Multiple Choice Feld::postTTT::Choice1##Choice2##Choice3??Hilfetext1\n' +
      'drop-down::dd_var1::1::Dropdown Feld::::Choice1##Choice2##Choice3??Hilfetext1';
    dataService.setElements(testScript.split('\n'), {});

    expect(dataService.rootBlock.elements.length).toEqual(5);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        id: 'text_var1',
        required: true,
        preText: 'Text eingeben',
        postText: 'Text nach Feld',
        maxLines: '0',
        maxLength: '10',
        helpText: 'Hilfetextxy',
        fieldType: 3
      } as unknown as TextInputElement
    ));
    expect(dataService.rootBlock.elements[1]).toEqual(jasmine.objectContaining(
      {
        id: 'num_var1',
        required: false,
        preText: 'Nummer eingeben',
        postText: 'Text nach Feld',
        minValue: '0',
        maxValue: '10',
        helpText: 'Hilfetext1',
        fieldType: 4
      } as unknown as NumberInputElement
    ));
    expect(dataService.rootBlock.elements[2]).toEqual(jasmine.objectContaining(
      {
        id: 'check_var1',
        value: '',
        required: false,
        preText: 'Bitte ankreuzen',
        helpText: null,
        fieldType: 7
      } as unknown as CheckboxElement
    ));
    expect(dataService.rootBlock.elements[3]).toEqual(jasmine.objectContaining(
      {
        id: 'mc_var1',
        value: '',
        required: true,
        preText: 'Multiple Choice Feld',
        postText: 'postTTT',
        options: 'Choice1##Choice2##Choice3',
        helpText: 'Hilfetext1',
        fieldType: 8
      } as unknown as MultiChoiceElement
    ));
    expect(dataService.rootBlock.elements[4]).toEqual(jasmine.objectContaining(
      {
        id: 'dd_var1',
        value: '',
        required: true,
        preText: 'Dropdown Feld',
        options: 'Choice1##Choice2##Choice3',
        helpText: 'Hilfetext1',
        fieldType: 9
      } as unknown as DropDownElement
    ));
  });

  it('should create basic if element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-end';

    dataService.setElements(testScript.split('\n'), {});

    expect(dataService.rootBlock.elements.length).toEqual(1);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true',
        falseElements: []
      } as IfThenElseBlock
    ));
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(
      jasmine.objectContaining(
        {
          text: 'Checked',
          fieldType: 0
        } as unknown as TextElement
      )
    );
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).not.toContain(
      jasmine.objectContaining(
        {
          text: 'CheckedDummy',
          fieldType: 0
        } as unknown as TextElement
      )
    );
  });

  it('should create basic if-else element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-else\n' +
      'text::elseText\n' +
      'if-end';
    dataService.setElements(testScript.split('\n'), {});

    expect(dataService.rootBlock.elements.length).toEqual(1);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true'
      } as IfThenElseBlock
    ));
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(
      jasmine.objectContaining(
        {
          text: 'Checked',
          fieldType: 0
        } as unknown as TextElement
      )
    );
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).falseElements).toContain(
      jasmine.objectContaining(
        {
          text: 'elseText',
          fieldType: 0
        } as unknown as TextElement
      )
    );
  });

  it('should create nested if-else element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-start::check_var2::true\n' +
      'text::Check var 2 true!\n' +
      'if-end\n' +
      'if-else\n' +
      'text::elseText\n' +
      'if-end';
    dataService.setElements(testScript.split('\n'), {});

    expect(dataService.rootBlock.elements.length).toEqual(1);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true'
      } as IfThenElseBlock
    ));

    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements.length).toEqual(2);
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(jasmine.objectContaining(
      {
        text: 'Checked',
        fieldType: 0
      } as unknown as TextElement
    ));
    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var2',
        conditionTrueValue: 'true'
      } as IfThenElseBlock
    ));

    expect((dataService.rootBlock.elements[0] as unknown as IfThenElseBlock).falseElements).toContain(
      jasmine.objectContaining(
        {
          text: 'elseText',
          fieldType: 0
        } as unknown as TextElement
      )
    );
  });

  it('should create basic repeat element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??HEpText\n' +
      'text::Repeat Inhalt\n' +
      'repeat-end';
    dataService.setElements(testScript.split('\n'), {});

    console.log(dataService.rootBlock.elements);
    console.log((dataService.rootBlock.elements[0] as RepeatBlock).templateElements);

    expect(dataService.rootBlock.elements.length).toEqual(1);
    expect(dataService.rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        id: 'examineecount',
        helpText: 'HEpText'
      } as RepeatBlock
    ));

    expect((dataService.rootBlock.elements[0] as RepeatBlock).templateElements.length).toEqual(1);
    expect((dataService.rootBlock.elements[0] as RepeatBlock).templateElements).toContain(jasmine.objectContaining(
      {
        text: 'Repeat Inhalt',
        fieldType: 0
      } as unknown as TextElement
    ));
  });
});
