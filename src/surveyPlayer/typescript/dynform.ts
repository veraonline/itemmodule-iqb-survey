import {IQBDialogBoxes} from './IQBDialogBoxes.js';

export class dynform {

	iqb_debug_starttime: number;
	dynform_table_count: number;
	dynform_repeats: number;
	dynform_repeats_metadata: any; // todo - more specific type
	dynform_instructions_count: number;
	dynform_instructions: any; // todo - more specific type;
	dynform_red_marked_elements: any; // todo - more specific type

	dynform_ifs: any; // todo - more specific type
	dynform_ifs_with_parent: any; // todo - more specific type;
	dynform_ifs_with_child: any; // todo - more specific type;
	dynform_ifs_existing_classes: any; // todo - more specific type;
	dynform_ifs_root_parents: any ; // todo - more specific type;

	dynform_debug_propagations: number = 0;

	dialogBoxes: IQBDialogBoxes;

	// help icon originally from https://www.iqb.hu-berlin.de/system/img/help-48.png
	helpIconPNG = `data:image/png;base64,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`;

	constructor (public divID: string, formData: string)
	{
		this.iqb_debug_starttime = new Date().getTime();

		this.dialogBoxes = new IQBDialogBoxes();

		this.dynform_table_count = 0; // wie viele Taballen wurden dynamisch generiert
		this.dynform_repeats = 0;
		this.dynform_repeats_metadata = [];
		this.dynform_instructions_count = 0;
		this.dynform_instructions = [];

		// this array stores a list of the element ids of all html elements currently highlighted with red 
		// (so that later they can be returned to normal)
		this.dynform_red_marked_elements = [];

		this.dynform_ifs = []; // saves all the if data
		this.dynform_ifs_with_parent = {}; // index ifs by parent for faster traversing
		this.dynform_ifs_with_child = {}; // index ifs by child for fast check if a child has parents
		this.dynform_ifs_root_parents = []; // list of root parents, from which to start when initializing all ifs (with propagation)

		// stores the classes of trs which actually exist, to quickly confirm if a Parent / Child element of an if exists
		this.dynform_ifs_existing_classes = {};


		/*
		Example:
								dynform_ifs.push ({      'ParentValue': ...,
															'Value': defelements[2],
														'ChildVariable': defelements[4]
									});
		*/

		const dynformDiv = document.getElementById(this.divID) as HTMLDivElement;
		dynformDiv.insertAdjacentHTML('afterbegin', `<input type="hidden" id="dynform_is_submitted" value="not submitted" mandatory="0">`);

		this.dynform_addElements(formData, false);

		const btnForward = document.getElementById('btnForward') as HTMLButtonElement;
		btnForward.onclick = () => this.sendForm();

		console.log('Dynform initialized');

	}

	getData(): string
	{
		// return this.dynform_getData(jQuery('#' + this.divID));
		return '';
	}

	setWaiterOn(): void
	{
	}


	setWaiterOff(): void
	{

	}

	iqb_debug_logtime(text: string)
	{
		const current_time = new Date().getTime();
		const time_elapsed = current_time - this.iqb_debug_starttime;

		console.log(text + ' at ' + time_elapsed);
	}

	/*
	::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	IQB-Sammlung jQuery-gestützter Bibliotheken

	Dynamische Formulare: anlegen, mit Daten füllen, Eingaben validieren,
	Daten auslesen; deutsch/englisch


	style-class, die bei Fehler für das Form-Element gesetzt wird:
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	formdef_inputerror
	Beispiel:
		.formdef_inputerror {
			border: 1px solid #FF0000;
		}
	::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	*/


	/* ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
	generiert aus Definition einen Formularblock
		$Target: jQuery-DOM-Objekt
		FormDef: Definition der Formularelemente (zeilenweise Strings), ggf. mit Übersetzungsliste
		flagMandatory: wenn true, dann wird Sternchen gesetzt bei Pflichtfeldern
	*/ 

	// todo: multiplechoice ID is not unique
	// todo: investigate if global variables are properly reseted when accessing form

	dynform_GetRepeatClass(RepeatID: number, Index: number): string
	{
		return 'dynform_repeat_' + String(RepeatID) + '_' + String(Index);
	}

	dynform_GetMaximumTimesTextboxID(RepeatID: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_maximum_times_textbox';
	}

	dynform_GetRepeatPreviousElementButtonClass(RepeatID: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_btn_previouselement';
	}

	dynform_GetRepeatNextElementButtonClass(RepeatID: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_btn_nextelement';
	}

	dynform_GetRepeatCurrentIndexLabelID(RepeatID: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_lbl_currentindex';
	}

	dynform_GetRepeatMaxIndexLabelID(RepeatID: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_lbl_maxindex';
	}

	dynform_GoToElement(RepeatID: number, index: number)
	{
		for (let i = 1; i <= this.dynform_repeats_metadata[RepeatID].MaximumTimes; i++)
		{
			$('.' + this.dynform_GetRepeatClass(RepeatID, i)).css('display', 'none');
		}

		$('.' + this.dynform_GetRepeatClass(RepeatID, index)).css('display', 'table-row');
		$('#' + this.dynform_GetRepeatCurrentIndexLabelID(RepeatID)).html(String(index));
		this.dynform_repeats_metadata[RepeatID].CurrentElement = index;
	}

	dynform_GetRepeatElementHeaderID(RepeatID: number, index: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_element_' + index + '_header';
	}

	dynform_GetRepeatElementHeaderTextID(RepeatID: number, index: number): string
	{
		return 'dynform_repeat_' + RepeatID + '_element_' + index + '_header_text';
	}

	dynform_CollapseRepeatElementHeader(RepeatID: number, Index: number)
	{
		const repeatClass: string = this.dynform_GetRepeatClass(RepeatID, Index);
		const repeatElementHeaderTextID: string = this.dynform_GetRepeatElementHeaderTextID(RepeatID, Index);

		const repeatElementHeaderID = this.dynform_GetRepeatElementHeaderID(RepeatID, Index);
		const repeatElementHeader = document.getElementById(repeatElementHeaderID) as HTMLSpanElement;

		// console.log(repeatElementHeaderID);
		// console.log(repeatElementHeader);

		$('.' + repeatClass).removeClass('iqb_dynform_repeat_tr_visible');
		$('.' + repeatClass).addClass('iqb_dynform_repeat_tr_invisible');
		$('#' + repeatElementHeaderTextID).html(this.dynform_repeats_metadata[RepeatID].ElementName + ' ' + Index + ' (+)');
		$.data(repeatElementHeader, 'Expanded', false);
	}

	dynform_ExpandRepeatElementHeader(RepeatID: number, Index: number)
	{
		const repeatClass: string = this.dynform_GetRepeatClass(RepeatID, Index);
		const repeatElementHeaderTextID: string = this.dynform_GetRepeatElementHeaderTextID(RepeatID, Index);

		const repeatElementHeaderID = this.dynform_GetRepeatElementHeaderID(RepeatID, Index);
		const repeatElementHeader = document.getElementById(repeatElementHeaderID) as HTMLSpanElement;

		$('.' + repeatClass).removeClass('iqb_dynform_repeat_tr_invisible');
		$('.' + repeatClass).addClass('iqb_dynform_repeat_tr_visible');
		$('#' + repeatElementHeaderTextID).html(this.dynform_repeats_metadata[RepeatID].ElementName + ' ' + Index + ' (-)');
		$.data(repeatElementHeader, 'Expanded', true);
	}

	dynform_GetRepeatElementHeaderHTML(RepeatID: number, Index: number, ElementName: string): string
	{
		let RepeatElementHeaderHTML = '';
		RepeatElementHeaderHTML += '<tr id="' + this.dynform_GetRepeatElementHeaderID(RepeatID, Index);
		RepeatElementHeaderHTML += '" class="iqb_noselect" style="text-decoration: underline; cursor: pointer;"><td colspan="2">';
		RepeatElementHeaderHTML += '<span id="' + this.dynform_GetRepeatElementHeaderTextID(RepeatID, Index) + '"></span></td></tr>';
		return RepeatElementHeaderHTML;
	}

	dynform_InitializeRepeatElementHeader(RepeatID: number, Index: number, ElementName: string)
	{
		const repeatElementHeaderID = this.dynform_GetRepeatElementHeaderID(RepeatID, Index);
		const repeatElementHeader = document.getElementById(repeatElementHeaderID) as HTMLSpanElement;

		this.dynform_CollapseRepeatElementHeader(RepeatID, Index);
		$.data(repeatElementHeader, 'Expanded', false);
		$.data(repeatElementHeader, 'ElementName', ElementName);

		$('#' + repeatElementHeaderID).on('click', () =>
		{
			if ($.data(repeatElementHeader, 'Expanded'))
			{
				this.dynform_CollapseRepeatElementHeader(RepeatID, Index);
			}
			else
			{
				this.dynform_ExpandRepeatElementHeader(RepeatID, Index);
			}

			// dynform_IfStateChangedForRepeat(RepeatID, Index);
		});
	}

	dynform_CollapseAllRepeats(): void
	{
		for (let i = 1; i <= this.dynform_repeats; i++)
		{
			// iterate through all repeats
			const RepeatMetadata = this.dynform_repeats_metadata[i];
			for (let j = 1; j <= RepeatMetadata.Times; j++)
			{
				// for each repeat, iterate through each repeat instance
				this.dynform_CollapseRepeatElementHeader(RepeatMetadata.RepeatID, j);
			}
		}
	}

	dynform_ExpandAllRepeats(): void
	{
		for (let i = 1; i <= this.dynform_repeats; i++)
		{
			// iterate through all repeats
			const RepeatMetadata = this.dynform_repeats_metadata[i];
			for (let j = 1; j <= RepeatMetadata.Times; j++)
			{
				// for each repeat, iterate through each repeat instance
				this.dynform_ExpandRepeatElementHeader(RepeatMetadata.RepeatID, j);
			}
		}
	}

	dynform_GetPromptHTML(ElementPrompt: string, Index: number): string
	{
		return '<strong>' + ElementPrompt + ' ' + Index + '</strong>';
	}

	dynform_GetSaveButtonHtml(): string
	{
		let saveButtonHTML: string = '';
		/*
		saveButtonHTML += '<button class="save" class="save" onclick="javascript:save();" title="Formulardaten speichern">';
		saveButtonHTML += 'Speichern (das ganze Formular)';
		saveButtonHTML += '</button>';
		*/
		return saveButtonHTML;
	}

	dynform_StringIsOnlyEmptySpacesOrEmpty(s: string): boolean
	{
		// This functions texts whether a string s contains only empty spaces
		for (let i = 0; i < s.length; i++)
		{
				if (s[i] !== ' ') {
					return false;
				}
		}
		return true;
	}

	dynform_ShowInstructions(InstructionsID: number)
	{
		const title = 'Hinweis';
		const infotext = this.dynform_instructions[InstructionsID];

		this.dialogBoxes.showMsgBox(infotext, title);
	}

	dynform_GetIfClass(ID: string)
	{
		// used in a dynform tr to be able to easily show / hide an entire tr when needed for the if-then functionality
		return 'dynform_if_class_' + ID;
	}

	dynform_GetRadioValue(name: string)
	{
		const $SelectedRadioElement = jQuery('input[name="' + name + '"]:checked');
		if ($SelectedRadioElement.length === 0) {
			return -1;
		}
		else {
			return $SelectedRadioElement.val();
		}
	}

	dynform_IfConditionIsTrue(index: number)
	{
		// this function checks if an if condition is fulfilled
		if (this.dynform_ifs[index].ParentVariableValue === this.dynform_GetRadioValue(this.dynform_ifs[index].ParentVariable)) {
			return true;
		}
		else {
			return false;
		}
	}

	dynform_PropagateIf(index: number, display, depth: number)
	{
		this.dynform_debug_propagations++;
		// console.log("PROPAGATING - " + index + " - " + display + " - " + depth);
		// this function propagates the effect of a change in an if condition;
		if (depth <= 100) // maximum depth of 100 to avoid infinite loops
		{
			const $ChildVariableElementTr = $('.' + this.dynform_GetIfClass(this.dynform_ifs[index].ChildVariable));

			if (display === 'none')
			{
				$ChildVariableElementTr.removeClass('iqb_dynform_if_tr_visible');
				$ChildVariableElementTr.addClass('iqb_dynform_if_tr_invisible');
			}
			else
			{
				$ChildVariableElementTr.removeClass('iqb_dynform_if_tr_invisible');
				$ChildVariableElementTr.addClass('iqb_dynform_if_tr_visible');
			}

			if (display === 'none')
			{
				// if currently hiding the control due to an if, remove value of multiple choice
				const $ChildVariableElement = $('input[name="' + this.dynform_ifs[index].ChildVariable + '"]');
				if (($ChildVariableElement.attr('type') === 'radio') ||
					($ChildVariableElement.attr('type') === 'checkbox'))
				{
					// only affect multiple choice and checkbox elements

					if ($ChildVariableElement.prop('checked') !== false) {
						$ChildVariableElement.prop('checked', false);
					}
				}
			}


			if (this.dynform_ifs_with_parent.hasOwnProperty(this.dynform_ifs[index].ChildVariable))
			{
				// if the child element in the if is in its turn parent to others, then propagate the effects to its child elements
				const AffectedIfs = this.dynform_ifs_with_parent[this.dynform_ifs[index].ChildVariable];
				for (let j = 0; j < AffectedIfs.length; j++)
				{
					if (display == 'none') {
						// if current parent is not visible, then a child must also not be visible
						this.dynform_PropagateIf(AffectedIfs[j], display, depth + 1);
					}
					else
					{
						// if the current parent is visible,
						// then a child can be either visible or invisible,
						// depending on whether it fulfills its if condition
						if (this.dynform_IfConditionIsTrue(AffectedIfs[j])) {
							// only show when child fulfills his own if condition
							this.dynform_PropagateIf(AffectedIfs[j], display, depth + 1);
						}
						else {
							// if child does not fulfill condition, then propagate a no display through child
							this.dynform_PropagateIf(AffectedIfs[j], 'none', depth + 1);
						}
					}
				}
			}
		}
	}

	dynform_IfStateChanged(index: number)
	{
		/*
		// todo - delete debugging code
		alert("IfStateChanged " + index);
		alert("parent variable - " + dynform_ifs[index].ParentVariable);
		alert("condition - " + dynform_ifs[index].ParentVariableValue);
		alert("state of affairs - " + dynform_GetRadioValue(dynform_ifs[index].ParentVariable));
		*/

		if (this.dynform_IfConditionIsTrue(index)) {
			this.dynform_PropagateIf(index, 'table-row', 1)
		}
		else {
			this.dynform_PropagateIf(index, 'none', 1);
		}
	}

	dynform_IfStateChangedAll()
	{
		// begin initializing and propagation from root parents (for efficiency purposes)
		for (let i = 0; i < this.dynform_ifs_root_parents.length; i++)
		{
			const RootParent = this.dynform_ifs_root_parents[i]; 
			// the Parent Variable from which to begin the propagation; this parent variable has no parents itself, and only children;

			for (let j = 0; j < this.dynform_ifs_with_parent[RootParent].length; j++) // go through all of its children
			{
				this.dynform_IfStateChanged(this.dynform_ifs_with_parent[RootParent][j]);  // and initialize them
			}
		}
	}

	/*
	function dynform_IfStateChangedForRepeat(RepeatID, Index)
	{
	for (var i = 0; i < dynform_ifs.length; i++)
	{
		if ((dynform_ifs[i]["RepeatID"] == RepeatID) && (dynform_ifs[i]["RepeatIndex"] == Index))
		{
					dynform_IfStateChanged(i);
		}
	}
	}
	*/

	dynform_ClassExists(class_to_check: string)
	{
		return ($('.' + class_to_check).length > 0);
	}

	dynform_InitializeIfs()
	{
		// idea to use jquery each in order to pass iterator to anonymous function from:
		// http://stackoverflow.com/a/6077407
		// http://stackoverflow.com/users/139054/scurker 
		// license (if applicable):  cc by-sa 3.0
		const NodeHasParents = {};

		// first, remove all ifs for which the parent / child input field does not exist
		this.iqb_debug_logtime('removing ifs for which parent / child element does not exist and building parent tree for faster traversing');
		console.log('Checking ' + this.dynform_ifs.length + ' possible ifs.');
		console.log('dynform_ifs:');
		const VerifiedIfs: any = []; // todo - stronger more precise type

		$.each(this.dynform_ifs, (index: number, dynform_if) =>
		{
			const ParentClass = this.dynform_GetIfClass(this.dynform_ifs[index].ParentVariable);
			const ChildClass = this.dynform_GetIfClass(this.dynform_ifs[index].ChildVariable);

			if (this.dynform_ifs_existing_classes.hasOwnProperty(ParentClass) && this.dynform_ifs_existing_classes.hasOwnProperty(ChildClass))
			{
				VerifiedIfs.push(this.dynform_ifs[index]);

				// index ifs by parent for faster traversing
				const NewIfIndex = VerifiedIfs.length - 1;
				const ParentVariable = dynform_if['ParentVariable'];
				const ChildVariable = dynform_if['ChildVariable'];

				if (this.dynform_ifs_with_parent.hasOwnProperty(ParentVariable) == false) {
					this.dynform_ifs_with_parent[ParentVariable] = [];
				}
				if (this.dynform_ifs_with_child.hasOwnProperty(ChildVariable) == false) {
					this.dynform_ifs_with_child[ChildVariable] = [];
				}
				this.dynform_ifs_with_parent[ParentVariable].push(NewIfIndex);
				this.dynform_ifs_with_child[ChildVariable].push(NewIfIndex);
			}
		});

		this.dynform_ifs = VerifiedIfs;
		this.iqb_debug_logtime('end of removing superflous ifs');

		// find out which if parents have no parents (so they serve to start propagations)
		this.iqb_debug_logtime('constructing root parent list');

		$.each(this.dynform_ifs,  (index: number, dynform_if) =>
		{
			const PotentialRootParent =  this.dynform_ifs[index].ParentVariable;
			if (this.dynform_ifs_with_child.hasOwnProperty(PotentialRootParent) === false) // if the potential root has no parents
			{
				// add the root parent
				// but first check if it isn't already in the list
				let already_exists = false;
				for (let i = 0; i < this.dynform_ifs_root_parents.length; i++)
				{
					if (this.dynform_ifs_root_parents[i] === PotentialRootParent)
					{
						already_exists = true;
						break;
					}
				}
				if (!already_exists) {
					this.dynform_ifs_root_parents.push(PotentialRootParent);  	// if it is not already in the root parent list, add it
				}
			}
		});

		this.iqb_debug_logtime('end of constructing root parent list');

		// then add if state changes handlers for the respective input fields

		this.iqb_debug_logtime('initializing ifs - adding ifstatechange handler');

		console.log('ifs to initialize: ' + this.dynform_ifs.length);
		$.each(this.dynform_ifs, (index: number, dynform_if) =>
		{
			$('input[name="' + dynform_if.ParentVariable + '"]').on('change', () =>
			{
				// console.log("CHANGE!");
				this.dynform_IfStateChanged(index);
			});

		});
		this.iqb_debug_logtime('initializing ifs - done adding handler and executing it once');
	}

	dynform_AddIf(dynform_if)
	{
		// as a first filter when adding ifs, avoid adding duplicates
		// further filtering will be done by the dynform_InitializeIfs() function

		let already_exists = false;

		for (let i = 0; i < this.dynform_ifs.length; i++)
		{
			if ((dynform_if['ParentVariable'] === this.dynform_ifs[i]['ParentVariable']) &&
				(dynform_if['ChildVariable'] === this.dynform_ifs[i]['ChildVariable']))
			{
				already_exists = true;
				break;
			}
		}

		if (!already_exists)
		{
			this.dynform_ifs.push(dynform_if);
		}
	}

	dynform_TrimWhitespace(s: string): string
	{
		return s.trim();
	}

	dynform_addElements (FormDef: string, flagMandatory) {

		this.iqb_debug_logtime('adding elements');

		const $Target = jQuery('#' + this.divID);

		let OnRepeat = false;
		let CurrentRepeatClass = '';
		let CurrentRepeatID = -1;
		let CurrentRepeatIndex = -1;
		let CurrentRepeatIndexString = '';
		let CurrentRepeatMaximumTimes;
		let CurrentRepeatBeginning;

		let CurrentRepeatPrompt = '';
		let CurrentRepeatElementName = '';
		let CurrentRepeatElementPrompt = '';
		let CurrentRepeatDefaultTimes = 0;

		const tooltip = '';

		const lines = FormDef.split("\n");

		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++)
		{
			const mainparts = lines[lineIndex].split('??'); // separates syntax about element from instructions about that element

			let instructions_td_html = '';
			if (mainparts.length >= 2)
			{
				this.dynform_instructions_count++;
				this.dynform_instructions[this.dynform_instructions_count] = mainparts[1];

				instructions_td_html = '<img id="iqb_dynform_instructions_questionmark_' + this.dynform_instructions_count + '" class="iqb_dynform_instructions_questionmark iqb_questionmark_image" title="' + mainparts[1] + '">';
			}

			if (mainparts.length > 0)
			{
				const defparts = mainparts[0].split('##');
				if (defparts.length > 0)
				{
					const defelements = defparts[0].split('::');
					defelements[0] = this.dynform_TrimWhitespace(defelements[0]); // white space bugs out command detection

					if (defelements.length > 0)
					{
						let mandatorymarker = '';
						if (defelements.length > 2)
						{
							if ((flagMandatory === true) && (defelements[2] === '1'))
							{
								mandatorymarker = '*';
							}
						}

						let trRepeatClass = '';
						let trIfClass = '';
						if (OnRepeat)
						{
							trRepeatClass = this.dynform_GetRepeatClass(CurrentRepeatID, CurrentRepeatIndex);
						}

						// console.log('COMMAND p1:');
						// console.log(defelements[0]);

						if (defelements[0] === 'repeat')
						{
							// console.log('running repeat command');

							OnRepeat = true;
							this.dynform_repeats++;
							CurrentRepeatID = this.dynform_repeats;
							CurrentRepeatIndex = 1;
							CurrentRepeatIndexString = '_' + String(CurrentRepeatIndex);
							CurrentRepeatBeginning = lineIndex;

							if (defelements.length >= 3) {
								CurrentRepeatMaximumTimes = parseInt(defelements[2], 10);
							}
							else {
								CurrentRepeatMaximumTimes = 5;
							}

							CurrentRepeatPrompt = 'Für wie viele Personen sind die folgende Daten benötigt?';
							if (defelements.length >= 2) {
								CurrentRepeatPrompt = defelements[1];
							}

							CurrentRepeatElementName = '';
							if (defelements.length >= 4) {
								CurrentRepeatElementName = defelements[3] + ' ';
							}

							CurrentRepeatElementPrompt = '';
							if (defelements.length >= 5) {
								CurrentRepeatElementPrompt = defelements[4] + ' ';
							}

							CurrentRepeatDefaultTimes = CurrentRepeatMaximumTimes;
							if (defelements.length >= 6) {
								CurrentRepeatDefaultTimes = parseInt(defelements[5], 10);
							}
							this.dynform_repeats_metadata[CurrentRepeatID] = {
													'Times': CurrentRepeatDefaultTimes,
													'MaximumTimes': CurrentRepeatMaximumTimes,
													'CurrentElement': 1,
													'ElementName': CurrentRepeatElementName,
													'ElementPrompt': CurrentRepeatElementPrompt,
													'RepeatID': CurrentRepeatID
												};


							$Target.append('<tr><td style="min-width: 30%">' + defelements[1] + mandatorymarker + '</td><td><input type="text" id="' + this.dynform_GetMaximumTimesTextboxID(CurrentRepeatID)
											+ '" name="' + this.dynform_GetMaximumTimesTextboxID(CurrentRepeatID) + '" ' + tooltip + ' mandatory="1" class="iqb_trigger_change_on_initialization" size="3" maxlength="3" /></td><td>' + instructions_td_html + '</td></tr>');

							(document.getElementById(this.dynform_GetMaximumTimesTextboxID(CurrentRepeatID)) as HTMLInputElement).value = String(CurrentRepeatDefaultTimes);

							// idea of which events to follow in order to detect text input from: http://stackoverflow.com/a/9955724
							// License: cc by-sa 3.0 
							// By: http://stackoverflow.com/users/1304994/atul-vani
							// Edited by: http://stackoverflow.com/users/1304994/atul-vani , http://stackoverflow.com/users/344480/matthias , http://stackoverflow.com/users/1217785/krishgopinath , http://stackoverflow.com/users/-1/community

							
							const MaximumTimesTextboxID: string = this.dynform_GetMaximumTimesTextboxID(CurrentRepeatID);
							const MaximumTimesTextbox: HTMLInputElement = document.getElementById(MaximumTimesTextboxID) as HTMLInputElement;
							const MaximumTimesTextboxChangeEvent =  () =>
							{
								// console.log('MaximumTimesTextboxChangeEvent executed');
								let value = parseInt(MaximumTimesTextbox.value, 10);
								if (value !== NaN)
								{
										if (value > 0)
										{
											if (value > this.dynform_repeats_metadata[CurrentRepeatID].MaximumTimes)
											{
												value = this.dynform_repeats_metadata[CurrentRepeatID].MaximumTimes;
												// alert('Es kann nicht mehr als ' + dynform_repeats_metadata[CurrentRepeatID].MaximumTimes + ' Elemente geben.');
											}
											this.dynform_repeats_metadata[CurrentRepeatID].Times = value;
											$('#' + this.dynform_GetRepeatMaxIndexLabelID(CurrentRepeatID)).html(String(value));

											for (let repeatInstance = 1; repeatInstance <= this.dynform_repeats_metadata[CurrentRepeatID].MaximumTimes; repeatInstance++)
											{
												if (repeatInstance <= this.dynform_repeats_metadata[CurrentRepeatID].Times)
												{
													const HeaderID = this.dynform_GetRepeatElementHeaderID(CurrentRepeatID, repeatInstance);
													$('#' + HeaderID).css('display', 'table-row');
												}
												else
												{
													this.dynform_CollapseRepeatElementHeader(CurrentRepeatID, repeatInstance);
													$('#' + this.dynform_GetRepeatElementHeaderID(CurrentRepeatID, repeatInstance)).css('display', 'none');
												}
											}
											if (this.dynform_repeats_metadata[CurrentRepeatID].CurrentElement > value) {
												this.dynform_GoToElement(CurrentRepeatID, 1);
											}
										}
								}
							};

							MaximumTimesTextbox.addEventListener('input', MaximumTimesTextboxChangeEvent);
							MaximumTimesTextbox.addEventListener('change', MaximumTimesTextboxChangeEvent);
							MaximumTimesTextbox.addEventListener('paste', MaximumTimesTextboxChangeEvent);

							$Target.append('<tr><td colspan=2><hr></td></tr>');
							$Target.append(this.dynform_GetRepeatElementHeaderHTML(CurrentRepeatID, 1, CurrentRepeatElementName));
							$Target.append('<tr class="' + this.dynform_GetRepeatClass(CurrentRepeatID, CurrentRepeatIndex) + '"><td>' + this.dynform_GetPromptHTML(CurrentRepeatElementPrompt, CurrentRepeatIndex) + '</td><td style="text-align: right">' + this.dynform_GetSaveButtonHtml() + '</td></tr>');
							// $Target.append('<tr><td colspan="2" style="text-align: center">' + PreviousElementHTML + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + NextElementHTML + '</td></tr>');				
						}

						if (defelements[0] === 'endrepeat')
						{
							CurrentRepeatIndex++;
							CurrentRepeatIndexString = '_' + String(CurrentRepeatIndex);

							if (CurrentRepeatIndex <= CurrentRepeatMaximumTimes)
							{
								lineIndex = CurrentRepeatBeginning;
								$Target.append(this.dynform_GetRepeatElementHeaderHTML(CurrentRepeatID, CurrentRepeatIndex, CurrentRepeatElementName));
								$Target.append('<tr class="' + this.dynform_GetRepeatClass(CurrentRepeatID, CurrentRepeatIndex) + '"><td>' + this.dynform_GetPromptHTML(CurrentRepeatElementPrompt, CurrentRepeatIndex) + '</td><td style="text-align: right">' + this.dynform_GetSaveButtonHtml() + '</td></tr>');
							}
							else
							{
								// collapse all elements by default
								for (let i = 1; i <= this.dynform_repeats_metadata[CurrentRepeatID].MaximumTimes; i++)
								{
									this.dynform_InitializeRepeatElementHeader(CurrentRepeatID, i, CurrentRepeatElementName);
								}

								// exit repeat mode
								OnRepeat = false;
								CurrentRepeatIndexString = '';

								$Target.append('<tr><td colspan="2"><hr></td></tr>');
							}
						}

						if (defelements[0] === 'if')
						{
								// defelements
								if (defelements.length >= 5)
								{
									// todo: more efficient repeat handling

									const ParentVariable = defelements[1];
									const ParentVariableValue = defelements[2];
									const ChildVariable = defelements[4];

									// if parent and child are not in a repeat
									this.dynform_AddIf({ 				    'ParentVariable': ParentVariable,
																		'ParentVariableValue': ParentVariableValue,
																		'ChildVariable': ChildVariable,
																		'RepeatID': CurrentRepeatID,
																		'RepeatIndex': CurrentRepeatIndex
													});

									if (CurrentRepeatIndexString !== '')
									{
										// if parent is not in a repeat, but child is
										this.dynform_AddIf({ 				    'ParentVariable': ParentVariable,
																			'ParentVariableValue': ParentVariableValue,
																			'ChildVariable': ChildVariable + CurrentRepeatIndexString,
																			'RepeatID': CurrentRepeatID,
																			'RepeatIndex': CurrentRepeatIndex
														});

										// if both parent and child are in a repeat	
										this.dynform_AddIf({  'ParentVariable': ParentVariable + CurrentRepeatIndexString,
														'ParentVariableValue': ParentVariableValue,
														'ChildVariable': ChildVariable + CurrentRepeatIndexString,
														'RepeatID': CurrentRepeatID,
														'RepeatIndex': CurrentRepeatIndex
														});
									}
								}
						}

						if (defelements[0] === 'hr')
						{
							if (defelements.length >= 2)
							{
								trIfClass = ' ' + this.dynform_GetIfClass(defelements[1] + CurrentRepeatIndexString) + ' ';
							}
							$Target.append('<tr class="' +  this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2"><hr></td></tr>');
						}

						if (defelements[0] === 'html_text') {
							if (defelements.length >= 2)
							{
								if (defelements.length >= 3) {
									trIfClass = ' ' + this.dynform_GetIfClass(defelements[2] + CurrentRepeatIndexString) + ' ';
								}
								const TextToAppend = defelements[1];

								$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2">' + TextToAppend + '</td><td>' + instructions_td_html + '</td></tr>');
							}
						}

						if (defelements[0] === 'titel') {
							const title = defelements[1];
							jQuery('h1').html(title);
							document.title = 'IQB - Begleitforschung - ' + title;
						}

						if (defelements[0] === 'comment') {
							$Target.append('<tr class="' + trRepeatClass + '"><td colspan="2">' + defelements[1] + '</td><td>' + instructions_td_html + '</td></tr>');
						}

						if (defelements[0] === 'header') {
							if (defelements.length >= 2)
							{
								if (defelements.length >= 3) {
									trIfClass += ' ' + this.dynform_GetIfClass(defelements[2] + CurrentRepeatIndexString) + ' ';
								}
								$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2"><h4>' + defelements[1] + '</h4></td><td>' + instructions_td_html + '</td></tr>');
							}
						}

						if (defelements[0] === 'checkbox') {
							this.dynform_table_count++;
							if (defelements.length >= 4) {
								trIfClass = ' ' + this.dynform_GetIfClass(defelements[3] + CurrentRepeatIndexString) + ' ';
							}
							$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2"><table id="dynform_table_' + (this.dynform_table_count) + '"></table></td><td>' + instructions_td_html + '</td></tr>');
							jQuery('#dynform_table_' + this.dynform_table_count).append('<tr><td width="20px"><input type="checkbox" id="' + defelements[3] + CurrentRepeatIndexString
									+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" value="true" ' + tooltip + 'mandatory="' + defelements[2] + '" /></td><td ' + tooltip + '>' + defelements[1] + mandatorymarker + '</td></tr>');
						}

						if ((defelements[0] === 'textbox'))
						{
							let formfieldlength = '57';
							let TextAfter = '';
							let MaxLengthHTML = '';

							let TextBeforeTextboxAlign = 'left';
							if (defparts.length >= 2) {
								TextBeforeTextboxAlign = defparts[1];
							}

							let NoTextBefore = true;
							if (defelements.length >= 2) {
								NoTextBefore = this.dynform_StringIsOnlyEmptySpacesOrEmpty(defelements[1]);
							}

							if (defelements.length >= 5) {
								TextAfter = ' ' + defelements[4];
							}
							if (defelements.length >= 6)
							{
								formfieldlength = defelements[5];
								MaxLengthHTML = ' maxlength="' + defelements[5] + '" ';
							}

							if (defelements.length >= 4) {
								trIfClass = ' ' + this.dynform_GetIfClass(defelements[3] + CurrentRepeatIndexString) + ' ';
							}

							const textAreaID = defelements[3] + CurrentRepeatIndexString;
							let numberOfLines = 1;
							if (defparts.length >= 2) {
								numberOfLines = parseInt(defparts[1], 10);
							}
							
							if (numberOfLines > 1)
							{
								if (NoTextBefore)
								{
									$Target.append('<tr class="' + trRepeatClass + '"><td colspan="2" style="text-align: center"><textarea id="' + textAreaID
											+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" ' + tooltip + ' cols="' + formfieldlength + '" rows="' + numberOfLines + '" mandatory="' + defelements[2] + '" ' + MaxLengthHTML + ' ></textarea>' + TextAfter + '</td><td>' + instructions_td_html + '</td></tr>');
								}
								else
								{
										$Target.append('<tr class="' + trRepeatClass + '"><td style="text-align: ' + TextBeforeTextboxAlign + '">' +  defelements[1] + mandatorymarker + '</td><td><textarea id="' + textAreaID
											+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" ' + tooltip + ' cols="' + formfieldlength + '" rows="' + numberOfLines + '" mandatory="' + defelements[2] + '" ' + MaxLengthHTML + ' ></textarea>' + TextAfter + '</td><td>' + instructions_td_html + '</td></tr>');							
								}
							} else {
								const input_type = 'text';
								const typemarker = '';

								if (NoTextBefore)
								{
									$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2" style="text-align: center"><input size="' + formfieldlength + '" id="' + textAreaID
											+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" ' + tooltip + typemarker + ' type="' + input_type + '" mandatory="' + defelements[2] + '" ' + MaxLengthHTML + ' />' + TextAfter + '</td><td>' + instructions_td_html + '</td></tr>');
								}
								else
								{
									$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td style="text-align: ' + TextBeforeTextboxAlign + '">' +  defelements[1] + mandatorymarker + '</td><td><input size="' + formfieldlength + '" id="' + textAreaID
											+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" ' + tooltip + typemarker + ' type="' + input_type + '" mandatory="' + defelements[2] + '" ' + MaxLengthHTML + ' />' + TextAfter + '</td><td>' + instructions_td_html + '</td></tr>');	
								}
							}

							if (defparts.length >= 3) // if the "numeric" / "string" type is also specified, separated by ##
							{
								const typeParts = defparts[2].split('**');
								typeParts.forEach((typePart: string, typePartIndex: number) => {
									// clean up any whitespace from the typeParts
									typeParts[typePartIndex] = this.dynform_TrimWhitespace(typeParts[typePartIndex]);
								});

								if (typeParts.length >= 1) {
									if (typeParts[0] === 'numeric') {
										// if the type is numeric, set its limits
										let minValue = -2000000000;
										let maxValue = 2000000000;
										if (typeParts.length >= 2) {
											minValue = parseInt(typeParts[1], 10);
										}
										if (typeParts.length >= 3) {
											maxValue = parseInt(typeParts[2], 10);
										}

										const textAreaElement = document.getElementById(textAreaID) as HTMLTextAreaElement;
										const numericEnforcer = () => {
											// enforce numeric rules for textbox
											const unparsedText = textAreaElement.value;
											let parsedText = '';
											for (let i = 0;  i < unparsedText.length; i++) {
												const c = unparsedText[i];
												if ((c === '0') || (c === '1') || (c === '2') || (c === '3') || (c === '4')  ||
													(c === '6') || (c === '7') || (c === '8') || (c === '9') || (c === '5') ||
													(c === '.') || (c === ',') || (c === '-'))
												{
													parsedText += c;
												}
											}

											// update textbox with the value that contains only allowed characters, if need be
											if (parsedText !== unparsedText) {
												textAreaElement.value = parsedText;
											}

											// enforce minimum value for textbox
											if (parseInt(parsedText, 10) < minValue) {
												const warningMessage = 'Die eingetragene Zahl für dieses Feld kann nicht kleiner als '  + minValue + ' sein.';
												this.dialogBoxes.showMsgBox(warningMessage, 'Ungültiger Wert', 'warning');
												textAreaElement.value = '';
											}

											// enforce maximum value for textbox
											if (parseInt(parsedText, 10) > maxValue) {
												const warningMessage = 'Die eingetragene Zahl für dieses Feld kann nicht größer als '  + maxValue + ' sein.';
												this.dialogBoxes.showMsgBox(warningMessage, 'Ungültiger Wert', 'warning');
												textAreaElement.value = '';
											}

										};

										textAreaElement.addEventListener('keyup', numericEnforcer);
										textAreaElement.addEventListener('change', numericEnforcer);
									}
								}
							}

						}

						if (defelements[0] === 'multiplechoice') {
							let optionstr = '';

							let align = 'left';
							if (defparts.length >= 3) {
								align = defparts[2];
							}
							if (defparts.length > 1)
							{
								const options = defparts[1].split('::');

								optionstr = optionstr + '<div style="text-align:' + align + '">';
								if (options.length >= 1)
								{
									let option_value = 0; // since we cannot rely on i, because it can also be incremented with newlines
									for (let optionIndex = 1; optionIndex < options.length; optionIndex++)
									{
										if (options[optionIndex] === 'newline')
										{
											optionstr = optionstr + '<div style="clear: both; height: 6px;"></div>';
										}
										else
										{
											option_value++;
											optionstr += '<div style="display: inline-block"><div style="float: left"><input type="radio" id="' + defelements[2] + CurrentRepeatIndexString + '" class="' + defelements[2] + CurrentRepeatIndexString + '"  value="'+String(option_value)+'" name="' + defelements[2] + CurrentRepeatIndexString + '" mandatory="' + defelements[1] + '" ' + tooltip + '></div><div style="position: relative; margin-right: 12px; float: left; max-width: 95%; word-wrap: break-word;">' + "&nbsp;" +  options[optionIndex] + '</div></div>'
										}
									}
								}
								optionstr = optionstr + '</div>';
							}

							if (defelements.length >= 3) {
								trIfClass = ' ' + this.dynform_GetIfClass(defelements[2] + CurrentRepeatIndexString) + ' ';
							}
							$Target.append('<tr class="' + this.dynform_TrimWhitespace(trRepeatClass + trIfClass) + '"><td colspan="2">' + optionstr + '</td><td>' + instructions_td_html + '</td></tr>');
						}

						if ((defelements[0] === 'selectlist') || (defelements[0] === 'multiselectlist')) {
							let optionstr = '';
							let boxsize = '3';
							if (defparts.length > 1)
							{
								const options = defparts[1].split('::');
								if (options.length > 2)
								{
									boxsize = options[0];
									for (let i = 1; i < options.length; i++)
									{
										optionstr += '<option value="' + options[i] + '" ' + tooltip + '>' +  options[i] + '</option>';
									}
								}
							}
							let multiselectstr = '';
							if (defelements[0] === 'multiselectlist') { multiselectstr = 'multiple="multiple" '; };

							$Target.append('<tr class="' + trRepeatClass + '"><td>' + defelements[1] + mandatorymarker + '</td><td><select id="' + defelements[3] + CurrentRepeatIndexString
									+ '" name="' + defelements[3] + CurrentRepeatIndexString + '" size="' + boxsize + '" mandatory="' + defelements[2] + '" ' + multiselectstr + '>' + optionstr + '</select></td><td>' + instructions_td_html + '</td></tr>');

						}

						if (trIfClass !== '') {
							this.dynform_ifs_existing_classes[this.dynform_TrimWhitespace(trIfClass)] = true;
						}

					} // end of if (defelements.length > 0)
				} // end of if (defparts.length > 0)
			} // end of if (mainparts.length > 0)
		} // end of for that loops through all lines of the unitDefinition

		document.querySelectorAll('.iqb_questionmark_image').forEach( (instructionsQuestionmarkElement: Element) => {
			const imageElement = instructionsQuestionmarkElement as HTMLImageElement;
			imageElement.src = this.helpIconPNG;
		});

		document.querySelectorAll('.iqb_dynform_instructions_questionmark').forEach( (instructionsQuestionmarkElement: Element) => {
			const instructionsID: number = parseInt(instructionsQuestionmarkElement.id.replace('iqb_dynform_instructions_questionmark_', ''), 10);
			instructionsQuestionmarkElement.addEventListener('click', () => {
				this.dynform_ShowInstructions(instructionsID);
			});
		});


		this.iqb_debug_logtime('done adding elements');

		this.iqb_debug_logtime('initializing ifs');

		this.dynform_InitializeIfs();

		this.iqb_debug_logtime('done initializing ifs');

		// enforce ifs
		this.iqb_debug_logtime('doing initial load - dynform_IfStateChangedAll();');
		this.dynform_IfStateChangedAll(); // used for dynform - if structures - refresh em after populating with data
		this.iqb_debug_logtime('done with initial load - dynform_IfStateChangedAll();');
		// end of enforcing ifs


		// console.log('Loaded: ');
		// console.log(this);
	}



	//  ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
	dynform_PointOutElement(id: string, duration: number, withcolor: boolean)
	{
		document.getElementById(id).scrollIntoView();
		$(window).scrollTop($(window).scrollTop() - 100);
		if (withcolor)
		{
			const $Element = $('#' + id);
			$Element.parent().css('background-color', '#ff5050');

			this.dynform_red_marked_elements.push(id);
			if (duration >= 0) // only remove it automatically if duration is positive;
				{
						const LocalID = id;
						setTimeout(() => {
							this.dynform_ReturnPointedOutElementToNormal(LocalID);
						}, duration);
				}
		}
	}

	dynform_ReturnPointedOutElementToNormal(id: string)
	{
		const $Element = $('#' + id);
		// console.log('Returning following element background color to normal:');
		// console.log($Element.parent());
		$Element.parent().css('background-color', 'transparent');
	}

	dynform_ReturnAllPointedOutElementsToNormal()
	{
		for (let i = 0; i < this.dynform_red_marked_elements.length; i++)
		{
			this.dynform_ReturnPointedOutElementToNormal(this.dynform_red_marked_elements[i]);
		}
		this.dynform_red_marked_elements = [];
	}

	MandatoryFieldsCheck(ExecuteSubmitFunction: Function)
	{
		// function that checks whether by "Send to IQB" option, all mandatory fields have been filled or not

		// first, expand all repeats, so as to make all form elements which might need to be filled visible
		this.dynform_ExpandAllRepeats();

		// assemble list of elements which needed to be filled but have not been filled
		const EmptyMandatoryFormElementIds: string[] = [];
		const $form = jQuery('#' + this.divID);
		$form.find('[mandatory]').each((index, Element) =>
		{
			const $Element = $(Element);
			if ($Element.attr('mandatory') === '1')
			{
				// to avoid showing elements which should not be considered due to a repeat element limit / if condition, only consider visible elements
				// jquery way to check: http://stackoverflow.com/a/178450
				// Stackoverflow post by: http://stackoverflow.com/users/18846/twernt
				// Edited by: http://stackoverflow.com/users/745188/elnur-abdurrakhimov,
				//            http://stackoverflow.com/users/1059101/jai,
				//            http://stackoverflow.com/users/1823841/pala%d1%95%d0%bd,
				//            http://stackoverflow.com/users/31671/alex,
				//            http://stackoverflow.com/users/18846/twernt
				// License:  cc by-sa 3.0

				if ($Element.is(':visible'))
				{
					if ($Element.is('textarea'))
					{
						if ($Element.val() === '') {
							EmptyMandatoryFormElementIds.push(String($Element.attr('id')));
						}
					}
					else
					{
						if ($Element.is('input'))
						{
							if ($Element.attr('type') === 'radio')
							{
								const name = $Element.attr('name');
								if (this.dynform_GetRadioValue(name) === -1)
								{
									const id = $Element.attr('id');
									if ($.inArray(id, EmptyMandatoryFormElementIds) === -1) {
										// check if id already in array, to avoid an entry for each multiple choice option	
										EmptyMandatoryFormElementIds.push(id);
									}
								}
							}
							else if ($Element.attr('type') === 'text')
							{
								if ($Element.val() === '') {
									EmptyMandatoryFormElementIds.push(String($Element.attr('id')));
								}
							}

							// note that checkboxes cannot be checked if they have been filled or not
						}
					}
				}
			}
	});

	// console.log(EmptyMandatoryFormElements);

	// if there are unfilled elements, then react accordingly
	this.dynform_ReturnAllPointedOutElementsToNormal();
	if (EmptyMandatoryFormElementIds.length > 0)
	{
		for (let i = 1; i < EmptyMandatoryFormElementIds.length; i++)
		{
			this.dynform_PointOutElement(EmptyMandatoryFormElementIds[i], -1, true);
		}
		this.dynform_PointOutElement(EmptyMandatoryFormElementIds[0], -1, true);

		let MessageText = 'Achtung! ';
		MessageText += String(EmptyMandatoryFormElementIds.length);
		MessageText += '  Felder sind noch nicht ausgefüllt (rot markiert). Möchten Sie trotzdem mit dem Absenden fortfahren?';

		this.dialogBoxes.confirmBox(MessageText, 'Nicht ausgefüllte Felder',
		() =>
		{
			// answer is yes function
			ExecuteSubmitFunction();
		},
		() => {
			// answer is no function
			this.dynform_PointOutElement(EmptyMandatoryFormElementIds[0], -1, false);
		},
		() => {
			// answer is cancel function
			this.dynform_PointOutElement(EmptyMandatoryFormElementIds[0], -1, false);
		});

	}
	else {
		ExecuteSubmitFunction();
	}
}


	sendForm()
	{
		this.MandatoryFieldsCheck(() =>
		{
			$('#dynform_is_submitted').val(Date.now());
			window.dispatchEvent(new CustomEvent('IQB.dynform.newData', {
                detail: {}
			}));

			window.dispatchEvent(new CustomEvent('IQB.dynform.nextPage', {
                detail: {}
            }));
			// window.location.reload();
		});
	}

	/* ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
	holt aus Form alle Werte
		$form: jQuery-DOM-Objekt
	*/
	dynform_getData() {
		let myReturn: string[] = [];
		// todo - check if non mandatory data is saved
		jQuery('#' + this.divID).find('[mandatory]').each(function (index, Element) {
			if ((($(this).attr('type') || '') == 'checkbox') || (($(this).attr('type') || '') == 'radio')){
				if ($(this).prop('checked')) {
					myReturn.push($(this).attr('id') + '::' + $(this).attr('value'));
				}
			} else {
				let controlvalue: string = String($(this).val()) || '';
				let typeattr = $(this).attr('isEmail');
				if (typeof typeattr !== 'undefined' && typeattr !== false) {
					controlvalue = controlvalue.replace(/ /g, '');
				} else {
					typeattr = $(this).attr('isInteger');
					if (typeof typeattr !== 'undefined' && typeattr !== false) {
						controlvalue = controlvalue.replace(/ /g, '');
					} else {
						if ($(this).get(0).tagName == 'TEXTAREA') {
							// Zeilenumbrüche maskieren
							controlvalue = controlvalue.replace(/\n/g, '^^');
							controlvalue = controlvalue.replace(/\f/g, '^^');
							controlvalue = controlvalue.replace(/\r/g, '^^');
							// controlvalue = cleanHTML(controlvalue);
							// todo - control value should still be cleaned a bit
						}
					}
				};

				if (controlvalue.length > 0) {
					myReturn.push($(this).attr('id') + '::' + controlvalue);
				}
			}
		});
		return myReturn;
	}

	/* ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
		loads data into the form
		fdata: array that stores data; each element represents a key-value pair separated by ::
	*/
	dynform_pushData(fdata: string[]) {

		this.iqb_debug_logtime('pushing data');

		const dataObject: {[key: string]: string} = {}; // key - value pair data storing object

		fdata.forEach((dataValue: string) => {
			const s = dataValue.split('::');
			if (s.length > 1) {
				dataObject[s[0]] = s[1];
			}
		});


		// console.log(dataArray);

		jQuery('#' + this.divID).find('[mandatory]').each(function (index, element: Element) {

			$(element).removeClass('formdef_inputerror');

			$(element).prop('disabled', false);

			const key = String($(element).attr('id'));
			let datavalue = '';
			if (dataObject.hasOwnProperty(key) === true) {
				datavalue = dataObject[key];
			};

			if (datavalue !== '') // so as not to override default vales
			{
				if (($(element).attr('multiple') || '') === 'multiple') {
					$(element).val(datavalue.split(','));
				} else {
					if (($(element).attr('type') || '') === 'checkbox')  {
						if (datavalue === 'true') {
							$(element).prop('checked', true);
						} else {
							$(element).prop('checked', false);
						}
					}
					else 
					{
						if (($(element).attr('type') || '') === 'radio')
						{
							if (datavalue === $(element).attr('value')) {
								$(element).prop('checked', true);
							} else {
								$(element).prop('checked', false);
							}
						}
						else {
							if ($(element).get(0).tagName === 'TEXTAREA') {
								// Zeilenumbrüche wiederherstellen
								datavalue = datavalue.replace(/\^\^/g, '\n');
							};
							$(element).val(datavalue);
							// if ($(this).attr('id') == 'dynform_repeat_1_maximum_times_textbox') console.log(datavalue);
						}
					}
				}
			}
			if ($(element).hasClass('iqb_trigger_change_on_initialization')) {
				element.dispatchEvent(new CustomEvent('change'));
			}
		});

		// initialize the status div if there is a status to report
		if (dataObject.hasOwnProperty('dynform_is_submitted'))
		{
			if (dataObject['dynform_is_submitted'] !== 'not submitted') {
				// const statusText = '<hr>' + 'Das Formular wurde zum IQB am ' + dataObject['dynform_is_submitted'] +' (lokale Zeit) gesendet.' + '<hr>';
				// $('.dynform_status_div').html(statusText);
			}
		}
		// end of initializing the status div

		this.iqb_debug_logtime('done pushing data');


		// enforce ifs
		this.iqb_debug_logtime('doing dynform_IfStateChangedAll();');
		this.dynform_IfStateChangedAll(); // used for dynform - if structures - refresh em after populating with data
		this.iqb_debug_logtime('done with dynform_IfStateChangedAll();');
		// done with enforcing ifs
	}
}
