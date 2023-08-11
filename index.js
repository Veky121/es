function getClass(value){return document.getElementsByClassName(value)}
function getId(value){return document.getElementById(value)}
function createEl(value){return document.createElement(value)}
function StorageGet(value){return localStorage.getItem(value)}
function StorageSet(key, value){return localStorage.setItem(key, value)}
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

//https://ipapi.co/json/

function log (code, value, value2, value3) {
    if (  StorageGet('ExtendedSenpa:Storage') == null || !JSON.parse( StorageGet('ExtendedSenpa:Storage') ).Settings.Utility.ConsoleLogger ) return
    if ( code == '' || code == null || code == undefined ) return console.warn('[ExtendedSenpa] Undefined code was passed into logging function, skipping logging')
    const css = { boldText: 'font-weight: bold;', module: 'color: #9d1fff; font-weight: bold;', default: 'font-weight: normal; color: white;'}
    const System_ =      (data) => {console.log( `%c[ExtendedSenpa] %c[System] %c${data}`,       css.module, css.boldText + 'color: #00f832;', css.default )}
    const Builder_ =     (data) => {console.log( `%c[ExtendedSenpa] %c[Builder] %c${data}`,      css.module, css.boldText + 'color: #0080d0;', css.default )}
    const Data_ =        (data) => {console.log( `%c[ExtendedSenpa] %c[Data] %c${data}`,         css.module, css.boldText + 'color: #dfff00;', css.default )}
    const BGScript_ =      (data) => {console.log( `%c[ExtendedSenpa] %c[BGScript] %c${data}`,       css.module, css.boldText + 'color: #ffa900;', css.default )}
    const Debugger_ =    (data) => {console.log( `%c[ExtendedSenpa] %c[Debug] %c${data}`,        css.module, css.boldText + 'color: #00ecff;', css.default )}
    const ErrorHandler_= (data) => {console.log( `%c[ExtendedSenpa] %c[ErrorHandler] %c${data}`, css.module, css.boldText + 'color: #ff1f1f;', css.default )}

    switch (code) {
        case 'SYSTEM': return System_(value);
        case 'BUILDER': return Builder_(value);
        case 'DATA' : return Data_(value);
        case 'BGSCRIPT': return BGScript_(value);
        case 'DEBUGGER': return Debugger_(value);
        case 'ERRORHANDLER': return ErrorHandler_(value);
        /*[==============================================]*/
        case 'MOD_START' : return System_(`User succestfully logged in, starting script`);
        case 'REMOVE_ADS': return Builder_(`Removing ads from webpage`);
        case 'OVERRIDE_DEFAULTS': return Builder_(`Overriding some default values on webpage`);
        case 'UPDATE_SENPA_LOGO': return Builder_(`Overriding main senpa logo with costum one for easy color change`);
        case 'GENERATE_SETTINGS': return Builder_(`Generating module settings and options for Mod Menu`);
        case 'SETUP_SECONDARY_LISTENRS': return Builder_(`Patching new event listeners for modal popups`);
        case 'GENERATE_MODMENU': return Builder_(`Generating new button and Mod Menu backpanel`);
        case 'MODMENU_NEW_SIDELIST': return Builder_(`Generating new side list option: ${value} in Mod Menu`);
        case 'MODULE_FIRST_STARTUP': return (`Detecting first time startup, patching default values into the module settings`);
        case 'MODULE_STARTUP': return (`Loading data into the module settings`);
        case 'MODMENU_NEW_CONTENT': return Builder_(`Generating new option type: ${value} in content: ${value2} with id: ${value3}`);
        case 'MODMENU_NEW_PROFILE': return Builder_(`Generating new option type: Profile in content: Profiles`);
        case 'MODMENU_SIDELIST_CHANGE': return System_(`Changing Mod Menu settings list from ${value} to ${value2}`);
        case 'MODMENU_EXECUTE_FUNCTION': return System_(`Executing function id: ${value} with value: ${value2}`);
        case 'DATA_UPDATE' : return Data_(`Saving option id:${value} with new data value: ${value2}`);
        case 'GENERATE_USERPORMPT': return System_(`Generating new user prompt`);
        case 'USERPROMPT_AGREE': return System_(`User succestfuly agreed to prompt send to them`);
        case 'USERPROMPT_DENY': return System_(`User succestfuly denied to prompt send to them`);
        case 'USERPROMPT_CLOSED': return System_(`Closing latest user prompt`);
        case 'PROFILE_UPDATE_NAME': return Data_(`Updating new profile name: ${value} to profile ${value2}`);
        case 'PROFILE_UPDATE_DATA': return Data_(`Updating new profile data from main menu to profile ${value}`);
        case 'PROFILE_LOAD_DATA': return System_(`Succestfully loaded data from ${value} and patched it into main menu`);
        case 'PROFILE_NOID': return ErrorHandler_(`No id found for selected profile, patching new id: ${value}`);
        case 'PROFILE_REMOVE': return Data_(`Succestfully removed profile: ${value} from local storage`);        
    }
}

let startupScriptRunOnce = 0
var checkMainMenuExistance = setInterval ( () => {
    if (getClass('main-menu')[0]?.childElementCount > 1) {
        if (startupScriptRunOnce == 0) {
            const user_login_prompt = getClass('panel center')[0].appendChild(createEl('div'))
            user_login_prompt.id = 'ES_UserLoginMsg'
            user_login_prompt.innerHTML = 'Please login to use ES Mod'
            getClass("advertisement-informer")[0]?.remove();
            getClass("ads-block-1")[0]?.remove();  
        }

        if (getClass('exp-area')[0]?.childElementCount > 1) {
            log('MOD_START')
            runScript ()
        }
        startupScriptRunOnce += 1
    }
})

function runScript (){
    clearInterval(checkMainMenuExistance)
    getId('ES_UserLoginMsg')?.remove()
    app()
    let faultCheck = 0
    log('DEBUGGER', 'Removing welcome popup message')
    function removeWelcomePopup () {
        let modal = ''
        document.querySelectorAll('.modal ').forEach( (modals) => { 
            const element = modals?.querySelector('.welcome-modal')
            if (element?.previousElementSibling.className == 'close-button') return modal = element.parentElement
        })
        if (!modal) return
        const welcomeTest = modal?.querySelector('.welcome-modal')
        modal?.setAttribute('style', 'display:none !important');
        if (!welcomeTest) testForFaultCheck()
        setTimeout( () => { modal?.querySelector('.close-button').click(); faultCheck = 0 }, 20)
        setTimeout( () => {
            if (welcomeTest) {
                log('DEBUGGER', 'Welcome popup was recreated... removing again..')
                removeWelcomePopup()
            } else testForFaultCheck();
        }, 100)
        function testForFaultCheck () {
            if (faultCheck <= 8) setTimeout( () => { removeWelcomePopup() }, 250)
            faultCheck += 1
        }
    } removeWelcomePopup ()
}

function app () {
    const mod_version = '4.3.2'
    const senpa_version = getClass('info-text')[0].children[0].innerText
    const senpa_client_id = getClass('account-id')[0].innerText.replace('ID: ', '')
    log('REMOVE_ADS')
    getId('gameadsbanner')?.remove();
    getId('bottomAd')?.remove()
    getClass('ads-block-1')[0]?.remove()
    getClass('advertisement-informer')[0]?.remove()
    getId('gameadsbanner-container')[0]?.remove()
    log('OVERRIDE_DEFAULTS')
    getClass("info-text")[0].outerHTML = '<div class="loop-holder"><div class="loop-holder__text">丨Modded By Veky and Shine丨</div><div class="loop-holder__text">丨Modded By Veky and Shine丨</div><div class="loop-holder__text">丨Modded By Veky and Shine丨</div>'
    document.querySelector('.chat-input').placeholder = '殺ExtendedSenpaす: Send message...'
    getClass("main-menu")[0].style.setProperty("border", "#ffffff00")
    getId('chat-control').children[0].innerHTML = 'Global'
    getId('screen').setAttribute('tabindex', 1)
    getId('chat-room').style.overflow = 'unset'
    setTimeout(function() { document.querySelectorAll('iframe').forEach( ( element ) => { element.remove() } )}, 2000)
    const NotificationContainer = getId('menu').appendChild(createEl('div'));
        NotificationContainer.outerHTML = '<div id="ES_Notification_container"></div>'

    function setupFakeSenpaLogo () {
        log('UPDATE_SENPA_LOGO')
        const main_logo = getClass('logo')[0].children[0]
        main_logo.src = 'https://i.imgur.com/GT7nmtK.png'
        main_logo.width = '103%'
        const fake_logo_pic = getClass('logo')[0].appendChild(document.createElement('img'))
        fake_logo_pic.id = 'ES_FakeLogo'
        fake_logo_pic.setAttribute('src', 'https://i.imgur.com/IZHYaPF.png')
        fake_logo_pic.setAttribute('style', 'width: 324px; height: 103px') 
    } setupFakeSenpaLogo()

    function SendNotification(text, time) {
        const defaultTimeout = 8
        const timeout = time ??= defaultTimeout
        const timeoutInSecconds = timeout * 1000
        const container = document.getElementById("ES_Notification_container");
        const notif = document.createElement("div");
        notif.classList.add("ES_Notification_toast");
        notif.innerText = text
        container.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, timeoutInSecconds);
    }
    log('GENERATE_SETTINGS')
    const ModMenuData = {
        /*
        {
            Type: '',
            Id: '',
            Name: '',
            Info: '',
            Extra: '',
            Style: '',
            Disabled : false,
            MultiBox : false,
        },
        */
        Menu : {
            ButtonIcon : '<i class="fas fa-folder-minus" style="color: #ffffff; padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type : 'ColorPicker',
                    Id : 'ES_menu-border_outline_color', 
                    Name : 'Border outline color',
                    Info : 'Makes main menu border outline the color of your choice.', 
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'ColorPicker',
                    Id : 'ES_menu-border_glow_color', 
                    Name : 'Border Glow Color',
                    Info : 'Makes main menu border glow the color of your choice.', 
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'ColorPicker',
                    Id : 'ES_menu-global_color', 
                    Name : 'Global Color',
                    Info : 'Changes lots of default senpa colors like buttons, switches, settings, etc.. to any of your choice.',
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                } ,{
                    Type : 'ColorPicker',
                    Id : 'ES_menu-senpa_logo_color', 
                    Name : 'Senpa Logo Color',
                    Info : 'Changes color of senpa logo to any of your choice.',
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'ColorPicker',
                    Id : 'ES_menu-server_list_color',
                    Name : 'Server List Color',
                    Info : 'Changes color of text on server name, players and gamemodes to any of your choice. Usefull when you have bright background.',
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'ColorPicker',
                    Id : 'ES_menu-account_panel_color',
                    Name : 'Discord User And Level Color',
                    Info : 'Changes color of text on login name, level, coins and levelxp to any of your choice. Usefull when you have bright background.',
                    Extra : 'Hex code',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },
                /*{
                    Type: 'Switch',
                    Id: 'ES_menu-enable_return_hud',
                    Name: '[ WIP ] Return Hud',
                    Info: 'Returns hud while your in main menu ( why did mistik remove this idk but im here to bring it back! )',
                    Extra: '',
                    Style: '',
                    Disabled : true,
                    MultiBox : false,
                },*/
                {
                    Type: 'Switch',
                    Id: 'ES_menu-disable_discord_button',
                    Name: 'Disable Senpa Discord Button',
                    Info: 'Hides senpa discord server button.',
                    Extra: '',
                    Style: '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type: 'Switch',
                    Id: 'ES_menu-disable_senpa_socials',
                    Name: 'Disable Senpa Socials',
                    Info: 'Hides senpa socials buttons.',
                    Extra: '',
                    Style: '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'Switch',
                    Id : 'ES_menu-disable_account_panel', 
                    Name : 'Disable Account Panel',
                    Info : 'Hides your account profile including levels, coins and levelxp and all of the buttons underneath.',
                    Extra : '',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'Switch',
                    Id : 'ES_menu-disable_account_experiance', 
                    Name : 'Disable Account experiance',
                    Info : 'Hides user experiance progression.',
                    Extra : '',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type: 'Switch',
                    Id: 'ES_menu-disable_account_buttons',
                    Name: 'Disable Account Buttons',
                    Info: 'Hides all of the buttons under account panel.',
                    Extra: '',
                    Style: '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'TextInput',
                    Id : 'ES_menu-input_background_image', 
                    Name : 'Background Image / Gif Url', 
                    Info : 'Set an image or even gif to your main menu, must to be google link over https protocol. Tip: upload your image to imagur and then load in it. Much faster loading and if the host page ever goes down, imagur wont :)', 
                    Extra : 'https:// direct link to an image or gif .jpg / .gif',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },
            ],
        },
        Chat : {
            ButtonIcon : '<i class="far fa-comments" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type : 'Slider',
                    Id : 'ES_chat-height',
                    Name : 'Set Chat Height',
                    Info : 'Sets the chat height of your choice.',
                    Extra : ' min = 300 max = 1000 step = 10',
                    Style : 'width: 270px;',
                    Disabled : false,
                    MultiBox : 'ChatSliders1',
                },{
                    Type : 'Slider',
                    Id : 'ES_chat-width',
                    Name : 'Set Chat Width',
                    Info : 'Sets the chat width of your choice.',
                    Extra : ' min = 230 max = 500 step = 10',
                    Style : 'width: 270px;',
                    Disabled : false,
                    MultiBox : 'ChatSliders1',
                },{
                    Type : 'Slider',
                    Id : 'ES_chat-font_size',
                    Name : 'Set Font Size',
                    Info : 'Sets font size of messages in chat box.',
                    Extra : ' min = 10 max = 20 step = 0.2',
                    Style : 'width: 270px;',
                    Disabled : false,
                    MultiBox : 'ChatSliders2',
                },{
                    Type : 'Slider',
                    Id : 'ES_chat-message_padding',
                    Name : 'Set Message Spacing',
                    Info : 'Sets spacing for all messages in chat box.',
                    Extra : ' min = 0 max = 15 step = 0.2',
                    Style : 'width: 270px;',
                    Disabled : false,
                    MultiBox : 'ChatSliders2',
                },{
                    Type : 'Switch',
                    Id : 'ES_chat-enable_antispam',
                    Name : '[ WIP ] Enable Chat Anti Spam Module',
                    Info : 'Detects if user is spamming, removes all previous repeted messages and sets number next to newest message they sent, number is count of repeted messages.',
                    Extra : '',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },{
                    Type : 'Switch',
                    Id : 'ES_chat-disable_message_timestamp',
                    Name : 'Hide The Time Message Was Sent',
                    Info : 'Hides the time message was sent in chat box.',
                    Extra : '',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },{
                    Type : 'Switch',
                    Id : 'ES_chat-disable_message_server',
                    Name : '[ WIP ] Hide All Server Messages In Chat',
                    Info : 'Removal server messages in chat, note messages are permanently removed and cant be shown back like Hide time message does. Only new created will be shown',
                    Extra : '',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },
            ],
        },
        Profile : {
            ButtonIcon : '<i class="fas fa-user" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type : 'ProfileUi',
                    Id : 'ES_profile-profileui',
                    Info : 'Profiles are copy of your settings set in main menu option, and are stored inside a "profile" meening you can have multiple desings of main menu and quickly switch between them.',
                    Extra : '',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                }
            ],
        },
        Scripts : {
            ButtonIcon : '<i class="fas fa-microchip" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type: 'Switch',
                    Id: 'ES_script-enable_remove_endgame',
                    Name: '[ WIP ] Remove Endgame Popup',
                    Info: 'Auto removes endgame popup with youtube video and continue button when user dies. [ REQUIRES DEBUGGER FOR BYPASS ISTRUE EVENT ]',
                    Extra: '',
                    Style: '',
                    Disabled : true,
                    MultiBox : false,
                },{
                    Type: 'Switch',
                    Id: 'ES_script-enable_auto_respawn',
                    Name: '[ WIP ] Auto respawn',
                    Info: 'Toggle auto respawn. Hold selected key after deth to respawn immediately. [ REQUIRES DEBUGGER FOR BYPASS ISTRUE EVENT ]',
                    Extra: 'NoKey',
                    Style: '',
                    Disabled : true,
                    MultiBox : false,
                },
            ],
        },
        'Import/Export' : {
            ButtonIcon : '<i class="fas fa-bars" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type: 'ImportExport',
                    Id : 'ES_impexp-buttons', 
                    Name : '', 
                    Info : 'Grabs selected data and compacts it into a code that you can use as backup or send to your friends so then can have same design as you.',
                    Extra : 'Think you mixed a good souce? export code and share it to your friends or show it off in our server!',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },{
                    Type: 'Switch',
                    Id : 'ES_impexp-enable_menu',
                    Name : '[ WIP ] Include Menu Settings',
                    Info : 'This will be permanently enabled, as you need something to export.',
                    Extra : '',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },{
                    Type: 'Switch',
                    Id : 'ES_impexp-enable_all', 
                    Name : '[ WIP ] Grab Everything',
                    Info : '[Warning] This will also grab the key in server settings and everything other, its not suggested sharing this to other people unelss you want to give them access to your account. Use this as your backup if you ever clear your cache.',
                    Extra : '',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },
            ],
        },
        Utils : {
            ButtonIcon : '<i class="fas fa-dice-d20" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                /*{
                    Type: 'Button',
                    Id : 'ES_DebugCurrentState',
                    Name : 'Get current state of ES Module',
                    Info : 'Grabs whole contents of html and css and current state of Mod loaded and packs it into a gigantic code, this is mostly useless to you but if you ever have problems with mod you can send this to veky and he will look into it.',
                    Extra : 'Get Info',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },*/{
                    Type: 'Switch',
                    Id : 'ES_utils-enable_console_logger',
                    Name : 'Run console logging for all modules',
                    Info : 'Sends feedback in console of what is mod currently doing and user updates of mod menu ( ctrl + shift + i > console )',
                    Extra : '',
                    Style : '',
                    Disabled : false,
                    MultiBox : false,
                },
            ],
        },
        Server : {
            ButtonIcon : '<i class="fas fa-server" style="color: #ffffff;  padding-left: 20px; padding-right: 10px; pointer-events: none;"></i>',
            Options : [
                {
                    Type : 'TextBox',
                    Id : 'ES_server-server_status',
                    Name : 'Server Status:',
                    Info : '',
                    Extra : 'N/A',
                    Style : 'padding-left: 80px;',
                    Disabled : false,
                    MultiBox : 'ServerStatus1',
                },{
                    Type : 'TextBox',
                    Id : 'ES_server-client_latency',
                    Name : 'Latency:',
                    Info : '',
                    Extra : 'N/A',
                    Style : '',
                    Disabled : false,
                    MultiBox : 'ServerStatus1',
                },{
                    Type : 'TextBox',
                    Id : 'ES_server-clinet_connection',
                    Name : 'Client:',
                    Info : '',
                    Extra : 'disconnected',
                    Style : 'padding-left: 140px;',
                    Disabled : false,
                    MultiBox : 'ServerStatus2',
                },{
                    Type : 'TextBox',
                    Id : 'ES_server-client_login',
                    Name : 'Logged in as:',
                    Info : '',
                    Extra : 'N/A',
                    Style : '',
                    Disabled : false,
                    MultiBox : 'ServerStatus2',
                },{
                    Type : 'TextInput',
                    Id : 'ES_server-key_password',
                    Name : '[ WIP ] Your key password for server communication',
                    Info : 'This will be used to login into our servers and unlock even more cool stuff, WORK IN PROGRESS: costum_name_colors, friends_on_senpa',
                    Extra : 'Example: User#0000:123456789012345678:a1b2c3d4e5f6g7h8i9j0',
                    Style : '',
                    Disabled : true,
                    MultiBox : false,
                },
            ],
        },
    }

    function runMainListeners () {
        log('SETUP_SECONDARY_LISTENRS')
        function waitForElement( e, callBack ){
            window.setTimeout( function () {
                var element = getClass(e)[0];
                if ( element ) {
                    callBack(e, element);
                } else {
                    waitForElement(e, callBack);
                }
            })
        }
        getId('replays-toggle')?.addEventListener('click', (e) => {
            waitForElement('modal ', function () { 
                updateHTML().Replays()
            })
        }, false)
        getId('skin-preview-1')?.addEventListener('click', (e) => {
            waitForElement('modal ', function () { 
                updateHTML().skinList()
            })
        }, false)
        getId('skin-preview-2')?.addEventListener('click', (e) => {
            waitForElement('modal ', function () { 
                updateHTML().skinList()
            })
        }, false)
        getId('pf-reserved-names-btn')?.addEventListener('click', (e) => {
            waitForElement('modal ', function () { 
                updateHTML().ReservName()
            })
        }, false)
        getId('pf-clans-btn')?.addEventListener('click', (e) => {
            waitForElement('modal ', function () { 
                updateHTML().Clans()
            })
        }, false)
    } runMainListeners ()

    function updateHTML () {
        const refreshReplays = () => {
        }
        const refreshskinList = () => {
            //TODO: create skin button to refresh to new free skins [ QOL ]
        }
        const refreshReservedNames = () => {
        }
        const refreshClans = () => {
        }
        return {
            Replays: refreshReplays,
            skinList: refreshskinList,
            ReservName: refreshReservedNames,
            Clans: refreshClans,
        }
    }

    function setupExtendedMenu (){
        log('GENERATE_MODMENU')
        const Page = getId('menu')
        const Mod_Button = getClass('setting-btn-container')[0].appendChild(createEl('div'));
        Mod_Button.outerHTML = '<div id="ES_Mod-Button"><i class="fas fa-meteor" style="color: #ffffff;"></i></div>';

        const Mod_Backpanel = Page.appendChild(createEl('div'))
        Mod_Backpanel.outerHTML = `<div id="ES_ModSettings" style="display: none;"><div class="ES_ModBackpanel-border-glow"></div><div id="ES_close-button"><i class="far fa-times-circle" style="color: #ffffff;"></i></div><div class="ES_settings-sidelist"></div><div class="ES_settings-toplist"></div><div class="ES_settings-content"></div><div></div></div>`
        
        const ES_UserPrompt = getId('ES_ModSettings').appendChild(createEl('div'))
        ES_UserPrompt.outerHTML = `<div class="ES_PorfilePrompt" style="display: none;"><div class="backpanel-glow"></div><div class="holder"><div class="name">Extended Senpa</div><div class="description"></div><button class="button">Yes</button><button class="button">No</button><button class="button">Okay</button></div></div>`

        const Mod_Version = getClass('ES_settings-sidelist')[0].appendChild(createEl('div'))
        Mod_Version.outerHTML = `<div class="ES_settings-Mod_Version">Extended Senpa v${mod_version}</div>`

        const MoreInformation = getClass('ES_settings-sidelist')[0].appendChild(createEl('div'))
        MoreInformation.outerHTML = `<div class="ES_settings-More_Information"><div class="S_info">Senpa: ${senpa_version}</div><div class="S_info">Client id: ${senpa_client_id}</div></div>`

        var Mod = {
            OpenButton: getId('ES_Mod-Button'),
            CloseButton: getId('ES_close-button'),
            Backpanel: getId('ES_ModSettings'),
            Settings: {
                SideList: getClass('ES_settings-sidelist')[0],
                TopList: getClass('ES_settings-toplist')[0],
                Content: getClass('ES_settings-content')[0],
                Version: getClass('ES_settings-Mod_Version')[0],
            },
        }

        const createSlideListOptions = ( Name, buttonImage ) => {
            log('MODMENU_NEW_SIDELIST', Name)
            const newSideListOption = Mod.Settings.SideList.appendChild(createEl('div'))
            setAttributes(newSideListOption, {
                'class': 'ES_settings-slidelist-tab',
                'data-name' : Name
            })

            const newContentOption = Mod.Settings.Content.appendChild(createEl('div'))
            setAttributes(newContentOption, {
                'class': 'ES_settings-content-tab',
                'data-name' : Name
            })

            newSideListOption.innerHTML = buttonImage + Name

            if (Mod.Settings.SideList.querySelectorAll('[data-name]').length == 1) {
                newSideListOption.setAttribute('active', '')
                newContentOption.setAttribute('active', '')
            }

            const ClearActive = () => {
                 Mod.Settings.SideList.querySelectorAll('[active]').forEach( (activeButton) => {
                    activeButton.removeAttribute('active')
                })
                Mod.Settings.Content.querySelectorAll('[active]').forEach( (activeContent) => {
                    activeContent.removeAttribute('active')
                })
            }

            const changeSettingType = ( button ) => {
                const nowOpen = getClass('ES_settings-sidelist')[0].querySelector('[active]').getAttribute('data-name')
                const newOption = button.target.attributes[1].value
                if ( nowOpen == newOption) return
                ClearActive()
                button.target.setAttribute('active', '')
                Mod.Settings.Content.querySelector(`[data-name="${newOption}"]`).setAttribute('active', '')
                log('MODMENU_SIDELIST_CHANGE', nowOpen, newOption)
            }
            newSideListOption.addEventListener('click', changeSettingType, false)
        }
        const functionManager = ( e, type, id, data ) => {
            const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
            switch ( type ) {
                case 'ColorPicker' :
                    e.target.previousSibling ? e.target.previousSibling.value = data : e.target.nextSibling.value = data
                    break
            }
            (function functionExecutor ( id, data ) {
                log('MODMENU_EXECUTE_FUNCTION', id, data)
                switch ( id ) {
                    case 'ES_menu-border_outline_color' :
                        getClass('main-menu')[0].style['border'] = `solid 2px ${data}`
                        break;
                    case 'ES_menu-border_glow_color' :
                        getClass('main-menu')[0].style['box-shadow'] = `0 0 24px ${data}`
                        break;
                    case 'ES_menu-global_color' :
                        updateGlobalColors( data )
                        break;
                    case 'ES_menu-senpa_logo_color' :
                        updateSenpaLogoColor( data )
                        break;
                    case 'ES_menu-server_list_color' :
                        getClass('panel right')[0].style['color'] = data
                        break;
                    case 'ES_menu-account_panel_color' :
                        getClass('account-profile')[0].style['color'] = data
                        break;
                    // case 'ES_menu-enable_return_hud' :
                    //     storage.Settings.Utility.ReturnHud = data;
                        break;
                    case 'ES_menu-disable_discord_button' :
                        if ( data ) { 
                            getClass('panel center')[0].querySelector('a[href="https://discord.gg/senpa"]').style['display'] = 'none' 
                        } else {
                            getClass('panel center')[0].querySelector('a[href="https://discord.gg/senpa"]').style['display'] = 'flex'
                        }
                        break;
                    case 'ES_menu-disable_senpa_socials' :
                        if ( data ) {
                            getId('socialsidebar').style['display'] = 'none'
                        } else {
                            getId('socialsidebar').style['display'] = 'block'
                        }
                        break;
                    case 'ES_menu-disable_account_panel' :
                        if ( data ) { 
                            getClass('account-profile')[0].style['display'] = 'none'
                        } else {
                            getClass('account-profile')[0].style['display'] = 'block'
                        }
                        break;
                    case 'ES_menu-disable_account_experiance' :
                        if ( data ) {
                            getClass('exp-area')[0].style['display'] = 'none'
                        } else {
                            getClass('exp-area')[0].style['display'] = 'flex'
                        }
                        break;
                    case 'ES_menu-disable_account_buttons' :
                        if ( data ) {
                            getId('pf-free-coins-btn').parentElement.style['display'] = 'none'
                            getId('pf-reserved-names-btn').parentElement.style['display'] = 'none'
                            getId('pf-clans-btn').parentElement.style['display'] = 'none'
                            getId('btnLogout').parentElement.style['display'] = 'none'
                        } else {
                            getId('pf-free-coins-btn').parentElement.style['display'] = 'block'
                            getId('pf-reserved-names-btn').parentElement.style['display'] = 'block'
                            getId('pf-clans-btn').parentElement.style['display'] = 'block' 
                            getId('btnLogout').parentElement.style['display'] = 'block' 
                        }
                        break;
                    case 'ES_menu-input_background_image' :
                        getClass('main-menu')[0].style['background-image'] = `url(${data})`
                        break;
                    case 'ES_chat-height' :
                        getId('chat-room').style['height'] = `${data}px`
                        break;
                    case 'ES_chat-width' :
                        getId('chat-room').style['width'] = `${data}px`
                        break;
                    case 'ES_chat-font_size' :
                        const StyleChatFontSize = document.createElement('style');
                        StyleChatFontSize.innerHTML = ` #chat-room div { font-size: ${data}px; }`;
                        document.head.appendChild(StyleChatFontSize);
                        break;
                    case 'ES_chat-message_padding' :
                        let StyleChatMessagePadding = document.createElement('style');
                        StyleChatMessagePadding.innerHTML = `#chat-room div { padding-bottom: ${data}px; }`;
                        getId('chat-control').querySelectorAll('[type="button"]').forEach( (btn)=> {
                            btn.style.bottom = `${data}px`
                        })
                        document.head.appendChild(StyleChatMessagePadding);
                        break;
                    case 'ES_chat-enable_antispam' :
                        storage.Settings.Utility.AntiSpam = data;
                        break;
                    case 'ES_chat-disable_message_timestamp' :
                        if ( data ) {
                            const style = document.createElement('style');
                            style.innerHTML = `
                            #chat-room div .time {
                                display: none;
                            }
                            `;
                            document.head.appendChild(style);
                        } else {
                            const style = document.createElement('style');
                            style.innerHTML = `
                            #chat-room div .time {
                                display: initial;
                            }
                            `;
                            document.head.appendChild(style);
                        }
                        break;
                    case 'ES_chat-disable_message_server' :
                        storage.Settings.Utility.ServerMessage = data;
                        break;
                    case 'ES_profile-profileui' :
                        AddProfile()
                        break;
                    case 'ES_impexp-buttons' :
                        if ( e.target.innerText == 'Import' ) {
                            Import_Settings()
                        } else {
                            Export_settings()
                        }
                        break;
                    case 'ES_utils-enable_console_logger' :
                        storage.Settings.Utility.ConsoleLogger = data;
                        break;
                }
                const blacklisted = ['ES_profile-profileui']
                if ( data == undefined || data == null || id == undefined || id == null ) return
                if ( blacklisted.includes(id) ) return
                log('DATA_UPDATE', id, data)
                storage.Settings.List[id] = data
                StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
            })( id, data )
        }
        var NewOption = ( category, type, id, name, info, extra, style, multibox, disabled ) => {
            log('MODMENU_NEW_CONTENT', type, category, id)
            const disable = disabled ? 'disabled' : ''
            const htmlData = () => { switch ( type ) {
                case 'ColorPicker' : return `<div ES_css="option" class="ES_colorPicker" id="${id}" ${disable}><div class="name">${name}</div><div class="holder"><input class="input" value="" size="7" placeholder="${extra}" es_data="change" ${disable}><input type="color" class="box" es_data="change" ${disable}></div><div class="fas fa-question-circle" ES_css="question-mark" style="left: 14px;"><div class="info">${info}</div></div></div>`
                case 'Switch' : return `<div ES_css="option" class="ES_switch" id="${id}" ${disable}><div class="name">${name}</div><label class="switch"><input type="checkbox" es_data="click" ${disable}><span class="slider"></span></label><div class="fas fa-question-circle" ES_css="question-mark" style="left: 102px; top: 7px;"><div class="info">${info}</div></div></div>`
                case 'TextInput' : return `<div es_css="option" class="ES_textinput" id="${id}" ${disable}><div class="name">${name}</div><div class="holder"><input class="input" value="" size="7" placeholder="${extra}" es_data="change" ${disable}><div class="fas fa-question-circle" es_css="question-mark" style="left: 4px;"><div class="info">${info}</div></div></div></div>`
                case 'Slider' : return `<div es_css="option" class="ES_slider" id="${id}" style="${style}" ${disable}><div class="name">${name}</div><div class="holder"><input class="range-slider__range" type="range" ${extra} es_data="input" ${disable}><div class="fas fa-question-circle" es_css="question-mark" style="left: 8px;top: -6px;"><div class="info">${info}</div></div></div></div>`
                case 'Button' : return `<div es_css="option" class="ES_button" id="${id}" ${disable}><div class="name">${name}</div><button class="es-button"><span class="text" es_data="click" ${disable}>${extra}</span></button><div class="info">${info}</div></div>`
                case 'TextBox' : return `<div ES_css="option" class="ES_textbox" id="${id}" style="${style}" ${disable}><div class="text">${name}</div><div class="value" ${disable}>${extra}</div></div>`
                case 'ProfileUi' : return `<div id="${id}"><span class="profile-name">Profile Name</span><span class="profile-name">Background Preview</span><button class="es-button" es_data="click">New Profile</button><div class="fas fa-question-circle" es_css="question-mark" style="top: 20px;left: 37px;"><div class="info">${info}</div></div></div>`
                case 'Profile' : return `<div profile-data="${id}"><input class="input" value="" size="7" placeholder="${name}" es_data="change"><div class="background">Background image<img src="https://senpa.io/full-logo.png" alt=""></div><button class="save" es_data="click">Save</button><button class="load" es_data="click">Load</button><button class="remove" es_data="click">Remove</button></div>`
                case 'ImportExport' : return `<div id="${id}" class="ES_import-export"><button class="import" es_data="click" ${disable}>Import</button><button class="export" es_data="click" ${disable}>Export</button><div class="holder"><input class="input" value="" size="7" placeholder="${extra}" ${disable}><div class="fas fa-question-circle" es_css="question-mark" style="left: 4px;"><div class="info">${info}</div></div></div></div></div>`
            }}
            if ( multibox != false ) {
                const multiboxExist = getId(multibox)
                if ( multiboxExist ) {
                    const newOption = multiboxExist.appendChild(createEl('div'))
                    newOption.outerHTML = htmlData()
                } else {
                    const newMultiBox = Mod.Settings.Content.querySelector(`[data-name="${ category }"]`).appendChild(createEl('div'))
                    newMultiBox.outerHTML = `<div id="${multibox}" class="multibox">${ htmlData() }</div>`
                }
            } else {
                const newOption = Mod.Settings.Content.querySelector(`[data-name="${ category }"]`).appendChild(createEl('div'))
                newOption.outerHTML = htmlData()
            }
            (function createEventListeners ( type, id ) {
                const blacklisted = ['Profile', 'ES_impexp-enable_menu', 'ES_impexp-enable_profile', 'ES_server-key_password']
                if ( blacklisted.includes(type) && blacklisted.includes(id) ) return
                const element = getId(id)
                element?.querySelectorAll('[es_data]').forEach( (data) => {
                    const eventType = data.getAttribute('es_data')
                    data.addEventListener(
                        eventType, (e) => { eventHandler(e, eventType) }, false
                    )
                })
                function eventHandler ( e, eventType ) {
                    if ( e == undefined ) return
                    let data = ''
                    if ( eventType == 'click' ) {
                        data = e.target.checked
                    } else {
                        data = e.target.value
                    }
                    functionManager ( e, type, id, data, false )
                }
            }) ( type, id );
        }
        function AddProfile ( data ) {
            log('MODMENU_NEW_PROFILE')
            const profilePanel = Mod.Backpanel.querySelectorAll('[data-name="Profile"]')[1]
            const profileAmmount = profilePanel.querySelectorAll('[profile-data]').length
            if ( data == null || data == undefined ) {
                NewOption('Profile', 'Profile', '0000', `Profile ${profileAmmount}`, null, null, null, false, false)
            } else {
                NewOption('Profile', 'Profile', data.id, `Profile ${profileAmmount}`, null, null, null, false, false)
                const NewProfile = profilePanel.lastChild
                NewProfile.querySelector('img').src = data.backgroundimage
                NewProfile.querySelector('.input').value = data.name
            }
            const NewProfile = profilePanel.lastChild
            NewProfile.querySelector('.input').addEventListener('change', (e)=>{ Helpers().Profile_Save(e).Name() }, false)
            NewProfile.querySelector('.save').addEventListener('click',   (e)=>{ Helpers().Profile_Save(e).Save() }, false)
            NewProfile.querySelector('.load').addEventListener('click',   (e)=>{ Helpers().Profiles_Load(e) }, false)
            NewProfile.querySelector('.remove').addEventListener('click', (e)=>{ Helpers().Profiles_Remove(e) }, false)
        }
        (function mainScript () {
            for (const [ category, category_data ] of Object.entries( ModMenuData ) ) {
                createSlideListOptions( category, category_data.ButtonIcon )
                for (const Object_ of Object.values( category_data.Options ) ) {
                    NewOption( category, Object_.Type, Object_.Id, Object_.Name, Object_.Info, Object_.Extra, Object_.Style, Object_.MultiBox, Object_.Disabled )
                }
            }
            function startupScript () {
                let storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
                if ( storage == undefined || storage == null ) {
                    log('MODULE_FIRST_STARTUP')
                    const newData = {
                        Settings : {
                            Utility : {
                                //ReturnHud : false,
                                AntiSpam: false,
                                ServerMessage: false,
                                ConsoleLogger : false,
                            },
                            List : {
                                "ES_menu-border_outline_color": "#00e1ff",
                                "ES_menu-border_glow_color": "#427bff",
                                "ES_menu-global_color": "#0051a8",
                                "ES_menu-senpa_logo_color": "#d630f8",
                                "ES_menu-server_list_color": "#ffffff",
                                "ES_menu-account_panel_color": "#ffffff",
                                "ES_menu-disable_discord_button": true,
                                "ES_menu-disable_senpa_socials": true,
                                "ES_menu-input_background_image": "https://i.imgur.com/vSFk3al.jpg",
                                "ES_chat-height": "300",
                                "ES_chat-width": "230",
                                "ES_chat-font_size": "13",
                                "ES_chat-message_padding": "0",
                            },
                        },
                        Profiles: {
                            Count : 0,
                            List : [
                                { dataid: "yxBgSl7gL6Dux2Z9Zz39DGkjpx7QHbMjxMmSP9Rq4vey8d3YbH", name: 'Default 1', backgroundimage: "https://i.imgur.com/vSFk3al.jpg", data : { "ES_menu-border_outline_color": "#00e1ff","ES_menu-border_glow_color": "#427bff","ES_menu-global_color": "#3b0b93","ES_menu-senpa_logo_color": "#79238b","ES_menu-server_list_color": "#ffffff","ES_menu-account_panel_color": "#ffffff","ES_menu-enable_return_hud": true,"ES_menu-disable_discord_button": true,"ES_menu-disable_senpa_socials": true,"ES_menu-input_background_image": "https://i.imgur.com/vSFk3al.jpg", } },
                                { dataid: "juFdxTBS3YL78UaraBpNlKiSSO04Jfewn6jaQksOMiRU4noYmK", name: "Veky's original", backgroundimage: "https://i.imgur.com/rpEUiBX.jpg", data : { "ES_menu-border_outline_color": "#ffd700","ES_menu-border_glow_color": "#cc7000","ES_menu-global_color": "#505050","ES_menu-senpa_logo_color": "#ad7600","ES_menu-server_list_color": "#ffffff","ES_menu-account_panel_color": "#ffffff","ES_menu-enable_return_hud": true,"ES_menu-disable_discord_button": true,"ES_menu-disable_senpa_socials": true,"ES_menu-input_background_image": "https://i.imgur.com/rpEUiBX.jpg", } },
                            ]
                        }
                    }
                    StorageSet('ExtendedSenpa:Storage', JSON.stringify(newData));
                }
                log('MODULE_STARTUP')
                storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
                for ( const [key, value] of Object.entries(storage.Settings.List) ) {
                    if (getId(key) != undefined) {
                        const element = getId(key).querySelector('[es_data]')
                        element[Helpers().checkOptionType(element)[1]] = value
                        if ( Helpers().checkOptionType(element)[0] != 'input' ) {
                            element.dispatchEvent( new Event(Helpers().checkOptionType(element)[0]) )
                        } else {
                            functionManager( 'dummy', 'Slider', key, value )
                        }
                    } else {
                        log('ERRORHANDLER', `Update what?? Got data with id: ${key} and value: ${value} but content does not exist in HTML Mod Menu`)
                        log('ERRORHANDLER', `Patching unset data`)
                        //TODO: patch this behavior
                    }
                }
                for ( i in storage.Profiles.List ) {
                    const dataProfile = storage.Profiles.List[i]
                    AddProfile( { id: dataProfile.dataid, name: dataProfile.name, backgroundimage: dataProfile.backgroundimage, } )
                }
            } startupScript();
            (function randomStuff () {
                Mod.OpenButton.addEventListener('click', () => { Mod.Backpanel.style.opacity = '1'; Mod.Backpanel.style.display = 'block' }, false);
                Mod.CloseButton.addEventListener('click', () => { Mod.Backpanel.style.opacity = '0'; setTimeout( ()=> { Mod.Backpanel.style.display = 'none' }, 200) }, false);
                getId('ES_impexp-enable_menu').querySelector('input').checked = true
                getId('ES_impexp-enable_menu').querySelector('input').setAttribute('disabled', '')
            })();
        })();
    } setupExtendedMenu ()

    function Helpers() {
        function newUserPrompt( msg, button, callback) {
            log('GENERATE_USERPORMPT')
            const element = document.querySelector('.ES_PorfilePrompt')
            const prompt = { 
                message: element.querySelector('.description'), 
                yes: element.querySelectorAll('.button')[0], 
                no: element.querySelectorAll('.button')[1], 
                okay: element.querySelectorAll('.button')[2] 
            }
            element.style.opacity = 1
            element.style.display = 'block'
            prompt['message'].innerText = msg
            const clearUi = () => {
                log('USERPROMPT_CLOSED')
                element.style.opacity = 0
                setTimeout( ()=> { element.style.display = 'none' }, 200)
                prompt['message'].innerText = ''
                prompt['yes'].removeEventListener('click', agree, false)
                prompt['no'].removeEventListener('click', deny, false)
                prompt['okay'].removeEventListener('click', deny, false)
            }
            function agree () {
                log('USERPROMPT_AGREE')
                clearUi();
                if ( callback ) callback();
            }
            function deny () {
                log('USERPROMPT_DENY')
                clearUi();
            }
            if ( button == 'YesNo' ) {
                prompt['yes'].style.display = '';
                prompt['no'].style.display = '';
                prompt['okay'].style.display = 'none';
                prompt['yes'].addEventListener('click', agree, false)
                prompt['no'].addEventListener('click', deny, false)
            } else {
                prompt['yes'].style.display = 'none';
                prompt['no'].style.display = 'none';
                prompt['okay'].style.display = '';
                prompt['okay'].addEventListener('click', deny, false)
            }
        }
        function Profile_Save( e ) {
            const Profile = e.target.parentNode
            const Profile_Name = Profile.querySelector('.input').value
            const senpaDefault = 'https://senpa.io/full-logo.png'
            const newKey = main_keys().safeNewKey(50)
            const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )


            function Name() {
                const currentKey = Profile.getAttribute('profile-data')
                if ( currentKey == '0000' ) {
                    log('PROFILE_NOID', newKey)
                    Profile.setAttribute('profile-data', newKey) 
                    storage.Profiles.List.push( {dataid: newKey, name : Profile_Name, backgroundimage : senpaDefault, data : null} )
                    StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
                    log('PROFILE_UPDATE_NAME', Profile_Name, newKey)
                } else {
                    for (let i in storage.Profiles.List ) {
                        const profile = storage.Profiles.List[i]
                        if ( currentKey == profile.dataid ) {
                            profile.name = Profile_Name
                        }
                    }
                    StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
                    log('PROFILE_UPDATE_NAME', Profile_Name, currentKey)
                }
            }
            function Save() {
                const currentKey = Profile.getAttribute('profile-data')
                const ProfileName__ = Profile_Name != '' ? Profile_Name : Profile.querySelector('.input').placeholder
                function save_() {
                    const menuData = getMenuData()
                    let menuImage = menuData['ES_menu-input_background_image']
                    if ( menuImage == '' ) menuImage = senpaDefault
                    Profile.querySelector('img').src = menuImage
                    if ( currentKey == '0000' ) {
                        log('PROFILE_NOID', newKey)
                        Profile.setAttribute('profile-data', newKey)
                        storage.Profiles.List.push({ dataid: newKey, name : Profile_Name, backgroundimage : menuImage, data : menuData })
                        StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
                        log('PROFILE_UPDATE_DATA', newKey)
                    } else {
                        for (let i in storage.Profiles.List ) {
                            const profile = storage.Profiles.List[i]
                            if ( currentKey == profile.dataid ) {
                                profile.backgroundimage = menuImage
                                profile.data = menuData
                            }
                        }
                        StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
                        log('PROFILE_UPDATE_DATA', currentKey)
                    }
                }   
                const Message = `Doing this will overwrite any data set to this profile: | ${ProfileName__} | with new data from main menu, are you sure you want to do this? This cannot be undone!`
                newUserPrompt(Message, 'YesNo', save_)
            }
            return { Save: Save, Name: Name}
        }
        function Profiles_Load( e ) {
            function load () {
                const profileElement = e.target.parentNode
                const currentKey = profileElement.getAttribute('profile-data')
                if ( currentKey == '0000' || currentKey == '' ) return 
                const profile = getProfileData( currentKey )
                for ( const [key, value] of Object.entries( profile.data ) ) {
                    const element = getId(key).querySelector('[es_data]')
                    if ( typeof value == 'boolean' ) {
                        element.checked = value
                    } else {
                        element.value = value
                    }
                    element.dispatchEvent( new Event(checkOptionType(element)[0]) )
                }
                log('PROFILE_LOAD_DATA', currentKey)
            }
            const Message = `Doing this will overwrite all of settings in menu, are you sure you want to do this? This cannot be undone!`
            newUserPrompt(Message, 'YesNo', load)
        }
        function Profiles_Remove( e ) {
            const profileElement = e.target.parentNode
            const currentKey = profileElement.getAttribute('profile-data')
            if ( currentKey == '0000') return profileElement.remove(), log('DATA', `Succestfully removed dummy profile from HTML`);

            function remove () {
                const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
                for (i in storage.Profiles.List) {
                    const profile = storage.Profiles.List[i]
                    if (currentKey == profile.dataid) {
                        const index = storage.Profiles.List.indexOf(profile);
                        const removedProfile = storage.Profiles.List.splice(index, 1);
                        StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
                        log('PROFILE_REMOVE', removedProfile[0].dataid );
                    }
                }
                profileElement.remove();
            }
            const name = profileElement.querySelector('.input').value != '' ? profileElement.querySelector('.input').value : profileElement.querySelector('.input').placeholder
            const Message = `Are you sure that you want to permanently delete: | ${name} | and all its contents inside? This cannot be undone!`
            newUserPrompt(Message, 'YesNo', remove)            
        }
        function refreshSkins () {
            const buttons = getId('skinsPagin')
            if (buttons.children[0].className == 'pagination-0') {
                buttons.children[0].click()
            }
            buttons.children[1].click()
            setTimeout(()=>{buttons.children[0].click()})
        }
        function mapBetween(currentNum, minAllowed, maxAllowed, min, max) {
            return (maxAllowed - minAllowed) * (currentNum - min) / (max - min) + minAllowed;
        }
        function getMenuData () {
            let data = {};
            const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') ).Settings.List
            for (const [key, value] of Object.entries(storage)) {
                if (key.includes('ES_menu-')) {
                    data[key] = value;
                } 
            }
            return data
        }
        function checkOptionType ( element ) {
            const type = element.getAttribute('es_data')
            const CheckType = {
                'change': 'value',
                'click': 'checked',
                'input': 'value',
            }
            return [type, CheckType[type]]
        }   
        function updateProfileData ( id, Object_ ) {
            const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
            const profiles_List = storage.Profiles.List
            for ( i in profiles_List ) {
                const profile = profiles_List[i]
                if ( id != profile.dataid ) return
                profile.data = Object_.data
            }
            StorageSet('ExtendedSenpa:Storage', JSON.stringify(storage))
        }
        function getProfileData ( id ) {
            let data 
            const profiles = JSON.parse( StorageGet('ExtendedSenpa:Storage') ).Profiles.List
            for (i in profiles) {
                const profile = profiles[i]
                if (profile.dataid == id) {
                    data = profile
                }
            }
            return data
        }
        function main_keys () {
            function randomKey (length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let counter = 0;
                while (counter < length) {
                  result += characters.charAt(Math.floor(Math.random() * characters.length));
                  counter += 1;
                }
                return result;
            }
            function keyExists (key) {
                let Check = false
                const storage = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
                const profiles_List = storage.Profiles.List
                for ( i in profiles_List ) {
                   if ( key == profiles_List[i].dataid ) Check = true;
                }
                return Check
            }
            function safeNewKey (length) {
                const key = randomKey(length)
                if( keyExists(key) ) {
                    return setTimeout( ()=>{ safeNewKey(length) }, 100)
                }
                return key
            }
            return { randomKey: randomKey, safeNewKey: safeNewKey }
        }
        return {
            newUserPrompt: newUserPrompt,
            refreshSkins: refreshSkins,
            mapBetween: mapBetween,
            Profile_Save: Profile_Save,
            Profiles_Load: Profiles_Load,
            getMenuData: getMenuData,
            Profiles_Remove: Profiles_Remove,
            checkOptionType: checkOptionType,
        }
    }
    function Import_Settings() {
        function import_ () {
            const localData = JSON.parse( StorageGet('ExtendedSenpa:Storage') )
            try {
                const checkOptionType = ( element ) => {
                    const type = element.getAttribute('es_data')
                    const CheckType = {
                        'change': 'value',
                        'click': 'checked',
                        'input': 'value',
                    }
                    return [type, CheckType[type]]
                }
                const handler = getId('ES_impexp-buttons').querySelector('input')
                if (
                    handler.value.length == 0 
                    || JSON.parse(handler.value).Settings == null 
                    || JSON.parse(handler.value).Settings == undefined
                ) return SendNotification('Error while trying to import data into module, textBox is invalid or empty.'), log('ERRORHANDLER', `Error while importing data into module, textBox length: ${handler.value.length}, Menu data: ${JSON.stringify(handler.value).Settings}`);

                (function setMenuData () {
                    const data = JSON.parse(handler.value)
                    for (const [id, value] of Object.entries(data.Settings.List)) {
                        const element = getId(id).querySelector('[es_data]')
                        element[checkOptionType(element)[1]] = value
                        if ( checkOptionType(element)[0] != 'input' ) {
                            element.dispatchEvent( new Event(checkOptionType(element)[0]) )
                        } else {
                            functionManager( 'dummy', 'Slider', key, value )
                        }
                    }
                })()
                if ( JSON.parse(handler.value).Profiles ) {
                    const data = JSON.parse(handler.value).Profiles
                    for ( i in data.List ) {
                        const dataProfile = storage.Profiles.List[i]
                        AddProfile( { id: dataProfile.dataid, name: dataProfile.name, backgroundimage: dataProfile.backgroundimage, } )
                    }
                }
                if ( JSON.parse(handler.value).Settings.Utility ) {
                    const data = JSON.parse(handler.value).Settings.Utility
                    for ( const [key, value] of Object.entries(data.Settings.Utility)) {
                        localData.Settings.Utility[key] = value
                    }
                    StorageSet('ExtendedSenpa:Storage', JSON.stringify(localData));
                }
                SendNotification('Successfully imported data into module')
            } catch ( err ) {
                SendNotification('Error while importing data into module, more infromation in console')
                log('ERRORHANDLER', `${err.message} || ${err.stack}`)
            }
        }
        const Message = `Doing this will overwrite all of settings in menu, are you sure you want to do this? This cannot be undone!`
        Helpers().newUserPrompt(Message, 'YesNo', import_)   
    }
    function Export_settings() {
        const handler = getId('ES_impexp-buttons').querySelector('input')
        const grabEverything = getId('ES_impexp-enable_all').querySelector('input').checked
        
    }

    
    const Endgame_Element = getId("endGame").parentElement
    const EndGame_Observer = new MutationObserver( (mutations) => {
        mutations.forEach( (mutationRecord) => {
            const target = mutationRecord.target.attributes.style.value
            if ( target.includes('opacity: 1;') && !target.includes('display: none;') ) {
                console.log('User died')
                //scripts.handleEndgame()
                const ButtonPosition = Endgame_Element.querySelector('button').getBoundingClientRect()
                // const PlayPosition = getId('play').getBoundingClientRect()
                setTimeout(()=>{ chrome.runtime.sendMessage({ x: ButtonPosition.x, y: ButtonPosition.y, }) }, 800)
                //Endgame_Element.style['display'] = 'none'
                //setTimeout(()=>{chrome.runtime.sendMessage({ x: PlayPosition.x, y: PlayPosition.y, }) }, 2000)
            }
        });
    });
    EndGame_Observer.observe(Endgame_Element, { attributes : true, attributeFilter : ['style'] });
    



    class Color {
        constructor(r, g, b) {
          this.set(r, g, b);
        }
        toString() {
          return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
        }
        set(r, g, b) {
          this.r = this.clamp(r);
          this.g = this.clamp(g);
          this.b = this.clamp(b);
        }
        hueRotate(angle = 0) {
          angle = angle / 180 * Math.PI;
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
          ]);
        }
        grayscale(value = 1) {
          this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
          ]);
        }
        sepia(value = 1) {
          this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
          ]);
        }
        saturate(value = 1) {
          this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
          ]);
        }
        multiply(matrix) {
          const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
          const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
          const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
          this.r = newR;
          this.g = newG;
          this.b = newB;
        }
        brightness(value = 1) {
          this.linear(value);
        }
        contrast(value = 1) {
          this.linear(value, -(0.5 * value) + 0.5);
        }
        linear(slope = 1, intercept = 0) {
          this.r = this.clamp(this.r * slope + intercept * 255);
          this.g = this.clamp(this.g * slope + intercept * 255);
          this.b = this.clamp(this.b * slope + intercept * 255);
        }
        invert(value = 1) {
          this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
          this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
          this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
        }
        hsl() {
          const r = this.r / 255;
          const g = this.g / 255;
          const b = this.b / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h, s, l = (max + min) / 2;
          if (max === min) {
            h = s = 0;
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }
          return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
          };
        }
        clamp(value) {
          if (value > 255) {
            value = 255;
          } else if (value < 0) {
            value = 0;
          }
          return value;
        }
    }
    class Solver {
        constructor(target, baseColor) {
          this.target = target;
          this.targetHSL = target.hsl();
          this.reusedColor = new Color(0, 0, 0);
        }
        solve() {
          const result = this.solveNarrow(this.solveWide());
          return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
          };
        }
        solveWide() {
          const A = 5;
          const c = 15;
          const a = [60, 180, 18000, 600, 1.2, 1.2];
          let best = { loss: Infinity };
          for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
              best = result;
            }
          }
          return best;
        }
        solveNarrow(wide) {
          const A = wide.loss;
          const c = 2;
          const A1 = A + 1;
          const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
          return this.spsa(A, a, c, wide.values, 500);
        }
        spsa(A, a, c, values, iters) {
          const alpha = 1;
          const gamma = 0.16666666666666666;
          let best = null;
          let bestLoss = Infinity;
          const deltas = new Array(6);
          const highArgs = new Array(6);
          const lowArgs = new Array(6);
          for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
              deltas[i] = Math.random() > 0.5 ? 1 : -1;
              highArgs[i] = values[i] + ck * deltas[i];
              lowArgs[i] = values[i] - ck * deltas[i];
            }
            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
              const g = lossDiff / (2 * ck) * deltas[i];
              const ak = a[i] / Math.pow(A + k + 1, alpha);
              values[i] = fix(values[i] - ak * g, i);
            }
            const loss = this.loss(values);
            if (loss < bestLoss) {
              best = values.slice(0);
              bestLoss = loss;
            }
          }
          return { values: best, loss: bestLoss };
          function fix(value, idx) {
            let max = 100;
            if (idx === 2) {
              max = 7500;
            } else if (idx === 4 || idx === 5) {
              max = 200;
            }
            if (idx === 3) {
              if (value > max) {
                value %= max;
              } else if (value < 0) {
                value = max + value % max;
              }
            } else if (value < 0) {
              value = 0;
            } else if (value > max) {
              value = max;
            }
            return value;
          }
        }
        loss(filters) {
          const color = this.reusedColor;
          color.set(0, 0, 0);
      
          color.invert(filters[0] / 100);
          color.sepia(filters[1] / 100);
          color.saturate(filters[2] / 100);
          color.hueRotate(filters[3] * 3.6);
          color.brightness(filters[4] / 100);
          color.contrast(filters[5] / 100);
      
          const colorHSL = color.hsl();
          return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
          );
        }
        css(filters) {
          function fmt(idx, multiplier = 1) {
            return Math.round(filters[idx] * multiplier);
          }
          return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
        }
    }  
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
          return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
          ]
          : null;
    }
    async function updateSenpaLogoColor(value) {
        try {
            const rgb = hexToRgb(value);
            const color = new Color(rgb[0], rgb[1], rgb[2]);
            const solver = new Solver(color);
            const result = solver.solve();
            getClass("logo")[0].children[0].style.cssText = result.filter
        } catch(e) {}
    };
    ( ()=> { getId('ES_menu-senpa_logo_color').querySelector('[es_data]').dispatchEvent( new Event('change') ) } )()
    function updateGlobalColors ( hexColor ) {
        const cssColors = 
            `<style>
                .reserved-names-modal button,
                .reserved-names-modal button:hover,
                .reserved-names-modal .add-reserved-name .opt-toggle .toggle-btn.active .slide,
                .skins-modal .content .pagination a.active,
                .skins-modal .imageUploadFile, .skins-modal button,
                .skins-modal .imageUploadFile, .skins-modal button:hover,
                .options .panel .content .setting.opt-range .range-box .fake-range .fill-outer .fill,
                .options .panel .sidebar .button.active, .options .panel .sidebar .button:active,
                .options .panel .content .setting.opt-toggle .toggle-btn.active .slide,
                .options button,
                .options button:hover,
                #menu .main-menu .panel.left .setting-btn-container #settings-toggle:hover,
                #menu .main-menu .panel.left .setting-btn-container #replays-toggle:hover,
                #menu .main-menu .panel.center #spectate:hover,
                #menu .main-menu .panel.center #play:hover,
                #account-box button:hover,
                #menu .main-menu .panel.left .setting-btn-container #custom-games-toggle, 
                #menu .main-menu .panel.left .setting-btn-container #music-toggle, 
                #menu .main-menu .panel.left .setting-btn-container #players-list-toggle, 
                #menu .main-menu .panel.left .setting-btn-container #replays-toggle, 
                #menu .main-menu .panel.left .setting-btn-container #settings-toggle,
                #menu .main-menu .panel.center #spectate,
                #menu .main-menu .panel.center #play,
                #account-box .account-profile .exp-fill,
                .store-coins-modal button,
                .modal .close-button,
                #account-box button,
                .clans-modal button,
                .clans-modal button:hover,
                #ES_Mod-Button {
                    background: ${hexColor};
                }
                .options .panel .content .setting.opt-range .range-box .fake-range .fill-outer .fill,
                #menu .main-menu .panel.left .setting-btn-container #settings-toggle:hover,
                #menu .main-menu .panel.left .setting-btn-container #replays-toggle:hover,
                #menu .main-menu .panel.right .region-selectors .tab.active,
                .skins-modal .imageUploadFile, .skins-modal button,
                .skins-modal .imageUploadFile, .skins-modal button:hover,
                #menu .main-menu .panel.center #spectate,
                #menu .main-menu .panel.center #spectate:hover,
                #menu .main-menu .panel.center #play,
                #menu .main-menu .panel.center #play:hover,
                #account-box .account-profile .exp-area,
                .skins-modal .tabs button:disabled,
                .clans-modal .tabs .tab.active,
                .clans-modal .tabs .tab.active:hover,
                .reserved-names-modal button,
                .minimap-root .server-timer,
                .store-coins-modal button,
                .clans-modal button,
                .options button,
                .minimap-root {
                    border-color: ${hexColor};
                }
                .profile-controls .skin-preview:hover {   
                    border: 5px solid ${hexColor};
                    transition: 100ms ease-out;
                }
                .profile-controls .skin-preview {
                    border: 3px solid ${hexColor};
                }
                .skins-modal .content .scrollview .grid-item .icon:hover,
                .panel-taps .import-tap .icon,
                .loop-holder__text {
                    color: ${hexColor};
                }
            </style>`;
    document.head.insertAdjacentHTML("beforeend", cssColors);
}}
(function cssOverides () {
    const SenpaOverrides = 
        `<style>
            :root {}
            ::-webkit-scrollbar {
                width: 0px;
            }
            .notransition {
                -webkit-transition: none !important;
                -moz-transition: none !important;
                -o-transition: none !important;
                transition: none !important;
            }
            #menu .main-menu .panel.right .list-container .list-row:hover:not(.active) {
                background: #ffffff30
            }
            #menu .main-menu .panel.right .list-container .list-row.active {
                background: #c9c9c94d 
            }
            #menu .main-menu .panel.right .list-container .list-row.header:hover,
            #menu .main-menu .panel.right .region-selectors .tab.active,
            #menu .main-menu .panel.right .list-container #server-list,
            #menu .main-menu .panel.right .region-selectors .tab,
            #menu .main-menu .panel.right .list-container,
            #account-box .account-profile .account-panel,
            #account-box .account-profile .exp-area,
            #ad-slot-center-panel, #main-left-panel,
            #server-list .region {
                background: transparent;
            }
            #menu .main-menu .panel.center #primary-inputs #name,
            #menu .main-menu .panel.center #primary-inputs #tag {
                background: #28282857
            }
            .profile-controls .skin-preview:not(:hover) {
                transition: 100ms ease-out;
            }
            #account-box #pf-avatar {
                border: 0px solid transparent;
            }
            #menu .main-menu .panel.center .logo img {
                width: 103%;
                height: 105px;
            }
            #menu .main-menu {
                background-image: url();
                background-size: 1015px 539px;
                box-shadow: 0 0 24px transparent;
                background-color: #11111100;
            }
            #chat-room #chat-control button {
                position : inherit;
            }
            .leaderboard {
                font-weight: 600;
            }
            #chat-room {
                overflow: unset;
            }
            .minimap-root .server-timer, .minimap-root {
                border: 2px solid
            }
            .panel-taps .import-tap:hover button {
                background: #0051a8;
            }
            #account-box .account-profile .account-id {
                display: none !important;
            }
            #endGame {
                transition: none !important;
            }
        </style>`;
    const ExtendedSenpaMain = 
        `<style>
            @keyframes textLoop {
                0% {
                    -webkit-transform: translate3d(0, 0, 0);
                    transform: translate3d(0, 0, 0)
                }
                100% {
                    -webkit-transform: translate3d(-100%, 0, 0);
                    transform: translate3d(-100%, 0, 0)
                }
            }
            @keyframes colorRotate {
                from { color: #6666ff; }
                10% { color: #0099ff; }
                50% { color: #00ff00; }
                75% { color: #ff3399; }
                100% { color: #6666ff; }
            }
            .loop-holder {
                display: flex;
                white-space: nowrap;
                overflow: hidden;
                position: relative;
            }
            .loop-holder__text {
                animation: textLoop 10s linear infinite;
                font-size: 100%;
                padding-right: .35em;
                resize: none;
                font-weight: bold;
            }
            #ES_Mod-Button {
                background: #e67bbe;
                border-radius: 4px;
                box-sizing: border-box;
                cursor: pointer;
                display: inline-block;
                font-size: 18px;
                height: 26px;
                padding-top: 2px;
                text-align: center;
                transition: all .3s;
                width: 60px;
                margin-left: 10px;
            }
            @property --rotate {
                syntax: "<angle>";
                initial-value: 132deg;
                inherits: false;
            }
            @keyframes spin {
                0% {
                    --rotate: 0deg;
                }
                100% {
                    --rotate: 360deg;
                }
            }
            #ES_ModSettings {
                opacity: 0;
                transition: 0.2s;
                margin: 0;
                position: absolute;
                top: 42%;
                -ms-transform: translateY(-50%);
                transform: translateY(-50%);
            
                #ES_close-button {
                    cursor: pointer;
                    font-size: 25px;
                    top: 8px;
                    right: 9px;
                    position: absolute;
                    max-height: 26px;
                }

                .ES_settings-Mod_Version {
                    animation: colorRotate 5s linear 0s infinite;
                    text-align: center;
                    padding: 11px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .ES_ModBackpanel-border-glow {
                    background: #191c29;
                    width: 800px;
                    height: 550px;
                    padding: 3px;
                    position: relative;
                    border-radius: 6px;
                    display: flex;
                    color: rgb(88 199 250 / 0%);

                    &:before {
                        content: "";
                        width: 822px;
                        height: 572px;
                        border-radius: 8px;
                        background-image: linear-gradient( var(--rotate) , #5ddcff, #3c67e3 43%, #4e00c2);
                        position: absolute;
                        z-index: -1;
                        top: -8px;
                        left: -8px;
                        animation: spin 2.5s linear infinite;
                    }
                    &:after {
                        position: absolute;
                        content: "";
                        left: 0;
                        right: 0;
                        z-index: -1;
                        height: 100%;
                        width: 100%;
                        margin: 0 auto;
                        transform: scale(0.8);
                        filter: blur(calc(550px / 6));
                        background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
                        opacity: 1;
                        transition: opacity .5s;
                        animation: spin 2.5s linear infinite;
                    }
                }
                .ES_settings-toplist {
                    position: absolute;
                    width: 572px;
                    height: 8%;
                    top: 0%;
                    left: 190px;
                }
                .ES_settings-sidelist {
                    background: #00000024;
                    position: absolute;
                    width: 190px;
                    height: 100%;
                    top: 0;
                    left: 0;

                    & div[data-name][active] {
                        background: #068bff4d;
                    }
                    .ES_settings-slidelist-tab {
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        padding: 10px;
                        font-weight: 500;
                        cursor: pointer;

                        &:hover {
                            background: #55adfa3d;
                        }
                    }
                    .ES_settings-More_Information {
                        position: absolute;
                        bottom: 0;
                        width: 80%;
                        padding: 20px;
                    }
                }
                .ES_settings-content {
                    border-bottom-right-radius: 1%;
                    background: #03000d66;
                    position: absolute;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    width: 616px;
                    left: 190px;
                    height: 92%;
                    top: 8%;

                    &:disabled {
                        background-color: dimgrey;
                        color: linen;
                    }

                    & div[data-name] {
                        display: none;
                    }
                    & div[ES_css="option"] {
                        padding: 16px;
                        transition: all 0.5s;
                        display: flex;
                    }
                    & div[data-name][active] {
                        display: block;
                    }
                    & [ES_css="question-mark"] {
                        color: #cbcbcb;
                        top: 9px;
                        position: relative;
                        max-height: 16px;

                        .info {
                            visibility: hidden;
                            width: auto;
                            height: auto;
                            min-width: 200px;
                            left: 99%;
                            top: 8%;
                            background: #1d212f;
                            border: 1px solid #5e4dcd;
                            padding: 14px;
                            z-index: 1;
                            position: fixed;
                            font-family: 'Rajdhani';
                            font-size: 15px;
                        }
                        &:hover .info {
                            visibility: visible;
                        }
                    }
                }
                .ES_PorfilePrompt {
                    position: absolute;
                    transition: 0.2s;
                    opacity: 0;
                    left: 300px;
                    top: 130px;
                    border: 3px solid #0056dd8a;
                    border-radius: 4px;
                    width: 320px;
                    height: 200px;
                    background: #191c29;
        
                    .holder {
                        position: absolute;
                        text-align: center;
                        width: 100%;
                        top: 0;

                        .name {
                            animation: colorRotate 5s linear 0s infinite;
                            font-weight: 800;
                            font-size: 20px;
                            margin: 10px;
                        }
                        .description {
                            font-size: 16px;
                            margin: 16px;
                        }
                        .button {
                            color: #fff;
                            border-radius: 3px;
                            height: 30px;
                            font-family: Rajdhani;
                            font-weight: 600;
                            font-size: 16px;
                            cursor: pointer;
                            width: 74px;
                            background: #6b5add;
                            border: none;
                            transition: all .3s;
                            margin: 10px;
                        }
                    }
                }
            }

            .ES_settings-content-tab {
                .name {
                    font-weight: 600;
                    font-size: 18px;
                    width: 70%;
                    display: inline-block;
                }
                .holder {
                    width: auto;
                    display: flex;  
                }
                .multibox {
                    display: flex;
                }
                .ES_colorPicker {
                    .input {
                        min-height: 36px;
                        max-width: 146px;
                        padding: 0 1rem;
                        color: #fff;
                        font-size: 14px;
                        border: 1px solid #5e4dcd;
                        border-radius: 6px 0 0 6px;
                        background-color: transparent;
                        margin: unset;
                    }
                    .box {
                        position: relative;
                        background: none;
                        width: 36px;
                        height: 36px;
                        padding: 3px 4px;
                        border: none;
                        border-radius: 0 6px 6px 0;
                        background-color: #5e4dcd;
                        color: #fff;
                        cursor: pointer;
                        transition: background-color .3s ease-in-out;
                    }
                }

                .ES_switch {
                    .switch {
                        font-size: 15px;
                        position: relative;
                        display: inline-block;
                        width: 3.5em;
                        height: 2em;
                        left: 70px;
                    }
                    .switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        inset: 0;
                        border: 2px solid #414141;
                        border-radius: 50px;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 1.4em;
                        width: 1.4em;
                        left: 0.2em;
                        bottom: 0.2em;
                        background-color: white;
                        border-radius: inherit;
                        transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
                    }
                    .switch input:checked + .slider {
                        box-shadow: 0 0 20px rgba(9, 117, 241, 0.8);
                        border: 2px solid #0974f1;
                    }
                    .switch input:checked + .slider:before {
                        transform: translateX(1.5em);
                    }
                }
                .ES_textinput {
                    display: inline-grid !important;

                    .input {
                        min-height: 38px;
                        min-width: 536px;
                        padding: 0 1rem;
                        color: #fff;
                        font-size: 14px;
                        border: 1px solid #5e4dcd;
                        border-radius: 6px;
                        background-color: transparent;
                        margin: 10px;      
                    }
                }
                .ES_slider {
                    display: grid !important;
                    
                    .range-slider__range {
                        -webkit-appearance: none;
                        height: 10px;
                        width: 89%;
                        border-radius: 5px;
                        background: #009fff4f;
                        outline: none;
                        padding: 0;
                        margin: 15px;
                    
                        &::-webkit-slider-thumb {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #2c3e50;
                            cursor: pointer;
                            transition: background .15s ease-in-out;
                        
                            &:hover {
                            background: #1abc9c;
                            }
                        }
                        
                        &:active::-webkit-slider-thumb {
                            background: #1abc9c;
                        }
                        &:focus {
                            &::-webkit-slider-thumb {
                                box-shadow: 0 0 0 3px #fff, 0 0 0 6px $;
                            }
                        }
                    }
                    .range-slider__value {
                        display: inline-block;
                        position: relative;
                        width: 60px;
                        color: #fff;
                        line-height: 20px;
                        text-align: center;
                        border-radius: 3px;
                        background: #2c3e50;
                        padding: 5px 10px;
                        margin-left: 8px;
                    
                        &:after {
                            position: absolute;
                            top: 8px;
                            left: -7px;
                            width: 0;
                            height: 0;
                            border-top: 7px solid transparent;
                            border-right: 7px solid #2c3e50;
                            border-bottom: 7px solid transparent;
                            content: '';
                            }
                    }
                }
                #ES_profile-profileui {
                    display: flex;

                    .profile-name {
                        color: #fff;
                        border: none;
                        font-size: 16px;
                        font-family: Rajdhani;
                        font-weight: 600;
                        display: inline-flex;
                        margin: 20px;
                        margin-left: 50px;
                    }

                    & button {
                        min-width: 102px;
                        max-height: 40px;
                        margin: 10px;
                        margin-left: 52px;
                    }
                }
                .es-button {
                    width: 70px;
                    text-align: center;
                    font-weight: 500;
                    cursor: pointer;
                    background: #23126b52;
                    color: white;
                    font-size: 16px;
                    padding: 1px;
                    border: 1px solid #5e4dcd;
                    font-family: Rajdhani;
                    box-sizing: border-box;
                    outline: none;
                    margin-left: 14px;
                    border-radius: 5px;

                    &:hover {
                        box-shadow: 0 0 15px #5e4dcd;
                        transition: .15s;
                    }
                    &:not(:hover) {
                        transition: .15s ease-out;
                    }
                }
                & div[profile-data] {
                    font-weight: 500;
                    font-size: 18px;
                    padding: 10px 15px;

                    .input {
                        min-height: 38px;
                        min-width: 150px;
                        padding: 0 1rem;
                        color: #fff;
                        font-size: 14px;
                        border: 1px solid #5e4dcd;
                        border-radius: 6px;
                        background-color: transparent;
                        margin: 10px;
                    }
                    .background {
                        font-size: 17px;
                        margin-left: 15px;
                        display: inline-block;

                        & img {
                            display: none
                        }
                        &:hover img {
                            display: block;
                            height: 50px;
                            width: 100px;
                        }
                    }
                    & button {
                        width: 70px;
                        text-align: center;
                        font-weight: 500;
                        cursor: pointer;
                        background: #23126b52;
                        color: white;
                        font-size: 16px;
                        padding: 1px;
                        border: 1px solid #5e4dcd;
                        font-family: Rajdhani;
                        box-sizing: border-box;
                        outline: none;
                        margin-left: 14px;
                        border-radius: 5px;

                        &:hover {
                            box-shadow: 0 0 15px #5e4dcd;
                            transition: .15s;
                        }
                        &:not(:hover) {
                            transition: .15s ease-out;
                        }
                    }
                }
                .ES_textbox {
                    .text {
                        font-size: 17px;
                        font-weight: 600;
                    }
                    .value {
                        padding-left: 6px;
                        font-size: 17px;
                        font-weight: 500;
                    }
                }
                .ES_import-export {

                    & button {
                        text-align: center;
                        font-weight: 500;
                        cursor: pointer;
                        background: #23126b52;
                        color: white;
                        font-size: 16px;
                        padding: 12px;
                        width: 200px;
                        border: 1px solid #5e4dcd;
                        font-family: Rajdhani;
                        box-sizing: border-box;
                        outline: none;
                        margin-left: 61px;
                        margin-top: 12px;
                        border-radius: 5px;

                        &:hover {
                            box-shadow: 0 0 15px #5e4dcd;
                            transition: .15s;
                        }
                        &:not(:hover) {
                            transition: .15s ease-out;
                        }
                    }
                    .input {
                        min-height: 38px;
                        min-width: 555px;
                        padding: 0 15px;
                        color: #fff;
                        font-size: 13px;
                        border: 1px solid #5e4dcd;
                        border-radius: 6px;
                        background-color: transparent;
                        margin: 10px;
                    }
                }
            }
        }
            #ES_EmojiButton {
                position: fixed;
                bottom: 31px;
                width: 40px;
                height: 40px;
                border-radius: 100%;
                display: none;
            }
            #ES_EmojiList {
                width: 370px;
                height: 220px;
                position: fixed;
                bottom: 69px;
                left: 862px;
                transform-origin: left;
                background: rgb(10 10 10 / 32%);
                display: grid;
                grid-template-columns: repeat(9, 1fr);
                gap: 5px;
                grid-auto-rows: 36px;
                overflow: hidden auto;
            }
            .ES_EmojiText:hover {
                transform: scale(1.3);
            }
            #ES_FakeLogo {
                position: absolute;
                left: 350px;
                top: 11px;
            }
            #ES_UserLoginMsg {   
                font-size: 20px;
                font-weight: 600;
                text-align: center;
            }
            #ES_Notification_container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                position: fixed;
                bottom: 230px;
                right: 10px;
            }
            .ES_Notification_toast {
                margin: 2px;
                padding: 12px;
                border: 2px solid #5e4dcd;
                border-radius: 4px;
                text-align: left;
                font-size: 14px;
                background: #181818a6;
                color: white;
                font-weight: 500;
                font-family: system-ui;
                max-width: 260px;
            }
            }
        </style>`;
    document.head.insertAdjacentHTML("beforeend", SenpaOverrides);
    document.head.insertAdjacentHTML("beforeend", ExtendedSenpaMain);
})();