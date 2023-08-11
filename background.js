chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
        var __target = sender.tab.id
        chrome.debugger.attach({ tabId: __target }, "1.2", function () {
            var x = request.x
            var y = request.y
            var button = 'left'
            var clickCount = 1
            chrome.debugger.sendCommand(
                { tabId: __target },
                "Input.dispatchMouseEvent",
                {
                    type: "mousePressed",
                    x: x,
                    y: y,
                    button: button,
                    clickCount: clickCount,
                },
            () => {
                chrome.debugger.sendCommand(
                    { tabId: __target },
                    "Input.dispatchMouseEvent",
                    {
                        type: "mouseReleased",
                        x: x,
                        y: y,
                        button: button,
                        clickCount: clickCount,
                    },
                () => {
                    chrome.debugger.detach({ tabId: __target });
                    console.log("y.");
                });
            }
            );
        });
});