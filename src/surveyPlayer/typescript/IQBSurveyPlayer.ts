import {dynform} from './dynform.js';
import {VO} from './vo.js';
import {initPolyfills} from './polyfills.js';

initPolyfills();

export class IQBSurveyPlayer {

    public unitDefinition: string;
    public sessionId: string;
    public dynformInstance: dynform;

    arrowForward = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAa0lEQVR4Ae3RAQaAQBhE4cACEHvQRQBpAehwQdjb1I/AEEIa7XsMAB8z0N+bY9UFU2LHtckHY4BKsaagr1EZFKgXULsbagQFqhfUdodyA1Wny1Z3DBgw2Q3TwIB5UHLAaMUDIygHjLYIhugEZkaqyaxtmsIAAAAASUVORK5CYII=`; 
    arrowBack = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAAZklEQVR4AWMYqSCZQY8axqQy/Gf4yGBBBWPA8BuDGYXGQOFeBg7yjcmhtTGjxpTAjTlMLWO4hosxDdQxppsyYxCgBt0geoTQqFE56FmEHpl21KhU2hjFRq0K0nTAq2wESAE2IkYBAPwljFlzjrZTAAAAAElFTkSuQmCC`;

        // -------------------------------------------
        constructor(options: VO.ToPlayer_DataTransfer) {

            console.log('Initializing IQB Survey Player based on the following options:');
            console.log(options);

            this.sessionId = options.sessionId;
            this.unitDefinition = options.unitDefinition;

            document.body.innerHTML = `
            <div id="contentDiv">

            <div style="text-align: left" class="multiform_status_div"></div>

            <div id="dynform"></div>

            <br />
            <div style="float: left;">
              <button id="btnBack"><img src="${this.arrowBack}" class="btnBackImage"></button>
            </div>
            <div style="float: right;">
              <button id="btnForward"><img src="${this.arrowForward}" class="btnForwardImage"></button>
            </div>

            <br style="clear: both" />

            <div style="text-align: left" class="multiform_status_div"></div>
            </div>
            `;

            this.dynformInstance = new dynform('dynform', this.unitDefinition);

            // initialize events
            this.initializeEvents();
            // load the item restore point if given
            if (typeof options.restorePoint === 'string') {
                this.loadRestorePoint(options.restorePoint);
            }

            const btnBack = document.getElementById('btnBack') as HTMLButtonElement;
            btnBack.onclick = () => {
                this.sendMessageToParent({
                    type: 'vo.FromPlayer.UnitNavigationRequest',
                    sessionId: this.sessionId,
                    navigationTarget: '#previous'
                });
            };

            window.addEventListener('IQB.dynform.nextPage', () => {
                this.sendMessageToParent({
                    type: 'vo.FromPlayer.UnitNavigationRequest',
                    sessionId: this.sessionId,
                    navigationTarget: '#next'
                });
            });

            this.sendMessageToParent({
                type: 'vo.FromPlayer.StartedNotification',
                sessionId: this.sessionId,
                validPages: ['mainSurveyPage'],
                currentPage: 'mainSurveyPage'
            });

            console.log('IQB Survey Player initialized');
        }

        // -------------------------------------------
        sendMessageToParent(message: VO.UnitPlayerMessageData) {
            parent.window.postMessage(message, '*');
            console.log('SurveyPlayer has sent the following message to its parent:');
            console.log(message);
        }

        // -------------------------------------------
        initializeEvents(): void {
            // this function initializes the event listeners, which are used to identify when new data is inputed by the test taker
            // when new data from the testee is available,
            // send it to the test controller via the sendMessageToParent() function,
            // using the 'vo.FromPlayer.ChangedDataTransfer' postMessage type

            document.querySelectorAll('input[type=radio]').forEach((element: Element) => {
                const radioElement = element as HTMLInputElement;
                radioElement.addEventListener('change', (e) => {
                    this.sendMessageToParent({
                        type: 'vo.FromPlayer.ChangedDataTransfer',
                        sessionId: this.sessionId,
                        restorePoint: this.getRestorePoint(),
                        response: this.getResponses(),
                        responseConverter: 'IQBSurveysV1'
                    });
                });
            });
            document.querySelectorAll('input[type=checkbox]').forEach((element: Element) => {
                const checkboxElement = element as HTMLInputElement;
                checkboxElement.addEventListener('change', (e) => {
                    this.sendMessageToParent({
                        type: 'vo.FromPlayer.ChangedDataTransfer',
                        sessionId: this.sessionId,
                        restorePoint: this.getRestorePoint(),
                        response: this.getResponses(),
                        responseConverter: 'IQBSurveysV1'
                    });
                });
            });

            document.querySelectorAll('input[type=text]').forEach((element: Element) => {
                const simpleInputElement = element as HTMLInputElement;
                simpleInputElement.addEventListener('keyup', (e) => {
                    this.sendMessageToParent({
                        type: 'vo.FromPlayer.ChangedDataTransfer',
                        sessionId: this.sessionId,
                        restorePoint: this.getRestorePoint(),
                        response: this.getResponses(),
                        responseConverter: 'IQBSurveysV1'
                    });
                });
            });

            document.querySelectorAll('textarea').forEach((element: Element) => {
                const textAreaElement = element as HTMLInputElement;
                textAreaElement.addEventListener('keyup', (e) => {
                    this.sendMessageToParent({
                        type: 'vo.FromPlayer.ChangedDataTransfer',
                        sessionId: this.sessionId,
                        restorePoint: this.getRestorePoint(),
                        response: this.getResponses(),
                        responseConverter: 'IQBSurveysV1'
                    });
                });
            });

            // general new data event handler
            window.addEventListener('IQB.dynform.newData', () => {
                this.sendMessageToParent({
                    type: 'vo.FromPlayer.ChangedDataTransfer',
                    sessionId: this.sessionId,
                    restorePoint: this.getRestorePoint(),
                    response: this.getResponses(),
                    responseConverter: 'IQBSurveysV1'
                });
            });
        }

        // -------------------------------------------
        getRestorePoint(): string {
            // this function computes the restore point at a certain moment for the item, in the form of a javascript object
            // it then stringifies the object into JSON and returns the JSON string
            return JSON.stringify(this.dynformInstance.dynform_getData());
        }

        // -------------------------------------------
        loadRestorePoint(restorePoint: string): boolean {
            //  loads the restore point contents into the item
            //  receives as input a restorePoint JSON string
            try {
                if (restorePoint !== null) {
                    if (restorePoint.length > 0) {
                        this.dynformInstance.dynform_pushData(JSON.parse(restorePoint));
                    }
                }
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }

        // -------------------------------------------
        getResponses() {
            // computes the responses based on the current state of an item
            return this.getRestorePoint();
            // return this.itemSubtypeFunctionality.getResponses();
        }

        // -------------------------------------------
        end() {
            // makeshift unload item function that probably doesn't completely and most efficiently dispose of an item
            // made to serve as an example for an end function
            let cleaningLoopsDone = 0;
            while ((document.body.childElementCount > 0) && (cleaningLoopsDone < 10000)) {
                document.body.childNodes.forEach(function (childNode) {
                    document.body.removeChild(childNode);
                });
                cleaningLoopsDone++;
            }
            document.body.innerHTML = '';
            return true;
        }
}

let itemPlayerInstance: IQBSurveyPlayer | null = null;
const postMessageListener = (event: MessageEvent) => {
    // console.log('Survey player has received the following message:');
    // console.log(event);

    if (typeof event.data !== 'undefined') {
    // event.data is set
        if (typeof event.data.hasOwnProperty('type')) {
            // ++++++++++++++++++++++++++++
            if (event.data.type === 'vo.ToPlayer.DataTransfer') {
                if (itemPlayerInstance != null) {
                    itemPlayerInstance.end();
                }
                itemPlayerInstance = new IQBSurveyPlayer({
                    'type': 'vo.ToPlayer.DataTransfer',
                    'sessionId': event.data.sessionId,
                    'unitDefinition': event.data.unitDefinition,
                    'restorePoint': event.data.restorePoint
                });
            } else if (event.data.type === 'vo.ToPlayer.NavigateToPage') {
                if (itemPlayerInstance != null) {
                        // console.log('Unit player confirms navigate to page request: "' + event.data.newPage + '"');
                        itemPlayerInstance.sendMessageToParent({
                            type: 'vo.FromPlayer.ChangedDataTransfer',
                            sessionId: itemPlayerInstance.sessionId,
                            currentPage: event.data.newPage
                        });
                }
            }
            // ++++++++++++++++++++++++++++
        }
    }
};

window.addEventListener('message', postMessageListener);

document.addEventListener('DOMContentLoaded', function(event) {
    parent.window.postMessage({
        'type': 'vo.FromPlayer.ReadyNotification',
        'version': '1'
    }, '*');
});

