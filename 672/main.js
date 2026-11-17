/*
 * Bashir Electronic — dedicated PS4 6.72 launcher
 * Source flow: w90008/22 505_960 package (672 entrypoint + 672 kernel stage).
 * Payload: the project's verified GoldHEN 2.4b18.14, served locally as goldhen.bin.
 * Only the 6.72 path is retained here; 9.00–14.02 use their existing engines.
 */
window.script_loaded = 0;

function sleep672(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function loadKernel672(source) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = source;
        script.async = false;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('تعذر تحميل ملف مرحلة النواة: ' + source)); };
        document.body.appendChild(script);
    });
}

async function waitKernelScript672() {
    var attempts = 0;
    while (window.script_loaded < 1 && attempts < 400) {
        await sleep672(50);
        attempts++;
    }
    if (window.script_loaded < 1) {
        throw new Error('انتهت مهلة تحميل ملف مرحلة النواة.');
    }
}

async function doJailBreak() {
    try {
        if (window.entrypoint672_result < 1) {
            window.setStatusMessage('فشلت تهيئة مدخل 6.72. أعد تشغيل الجهاز ثم حاول مجدداً.', 'failure');
            return;
        }
        if (window.exploitsetup672_result < 1) {
            window.setStatusMessage('فشل إعداد الاستغلال لإصدار 6.72. أعد تشغيل الجهاز ثم حاول مجدداً.', 'failure');
            return;
        }

        window.setStatusMessage('اكتملت تهيئة 6.72. جارٍ تشغيل مرحلة النواة...', 'progress');
        await sleep672(200);
        window.script_loaded = 0;
        await loadKernel672('672/672kexploit.js');
        await waitKernelScript672();

        var result = KernelExploit672();
        if (result === 0 || result === 91) {
            window.setStatusMessage('نجحت مرحلة النواة. جارٍ تحميل GoldHEN 2.4b18.14...', 'progress');
            getPayload672('goldhen.bin');
            return;
        }
        if (result === 179) {
            window.setStatusMessage('يبدو أن الجهاز مفعّل مسبقاً. تحقق من ظهور إعدادات GoldHEN.', 'success');
            return;
        }
        window.setStatusMessage('فشل التحميل للأسف! أعد تشغيل الجهاز وحاول مجدداً.', 'failure');
    } catch (error) {
        window.setStatusMessage('حدث خطأ في مسار 6.72: ' + (error && error.message ? error.message : String(error)), 'failure');
    }
}
