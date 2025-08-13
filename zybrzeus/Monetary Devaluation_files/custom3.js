function loadFile(srcs, callback) {
    let filesList = [];
    if (!Array.isArray(srcs)) {
        filesList = [srcs]
    } else {
        filesList = srcs;
    }
    let loaded = 0;
    filesList.forEach((src, key) => {
        const typeParts = src.split('.');
        const NameParts = src.split('/');
        let type = typeParts[typeParts.length - 1];
        const id = 'sam-' + (NameParts[NameParts.length - 1].replace('.' + type, '')) + type;
        const el = document.getElementById(id);
        if (!(typeof (el) != 'undefined' && el != null)) {
            const file = document.createElement(type === 'css' ? 'link' : 'script');
            file[type === 'css' ? 'href' : 'src'] = src;
            if (type === 'css') {
                file['rel'] = 'stylesheet';
                file['type'] = 'text/css';
            } else {
                file['type'] = 'text/javascript';
            }
            file.id = id;
            file.setAttribute('defer', '');
            file['onreadystatechange'] = file.onload = function () {
                loaded++
            };
            document.getElementsByTagName('head')[0].appendChild(file);
        } else {
            loaded++;
        }
    });
    if (callback) {
        setTimeout(() => {
            if (loaded == filesList.length) {
                callback()
            }
        }, 500)
    }
}

jQuery(document).ready(function ($) {
    $('[data-stylesheet]').each(function () {
        var srcs = $(this).data('stylesheet').split(',');
        if (srcs.length > 0) {
            loadFile(srcs);
        }
    });
    var body = $('body');
    var host = window.location.host.replace('www.', '');
    var site_url_secure = 'https://office.' + host + '/#/register';
    var site_url = 'http://office.' + host + '/#/register';
    var register_button = body.find('[href="' + site_url + '"],[href="' + site_url_secure + '"]');
    if (typeof _ref === 'undefined') {
        var _ref = localStorage.getItem('_ref');
    }
    if (_ref) {
        register_button.attr('href', site_url_secure + '/' + _ref);
    } else {
        register_button.remove();
    }

    $('.ticker_fade').list_ticker({
        speed: 4000,
        effect: 'fade'
    });

    // load Countdown if exists
    if (body.find('.cd-wrapper').length > 0) {

        loadFile('https://zybrzeus.com/builder/elements/js-files/jquery.countdown.min.js', function () {
            // load js file
            $('.cd-hidden').show();
            body.find('.cd-wrapper').each(function () {
                let counterDate = new Date($(this).attr('redirect-time'));
                // time-reload feature is used for reload countdown timer every week
                // custom request from mauricio for this
                if ($(this).attr('time-reload') === '1') {
                    const now = new Date();
                    const diff = counterDate.getTime() - now.getTime();
                    if (diff < 0) {
                        counterDate = new Date();
                        counterDate.setDate(counterDate.getDate() + (4 + 7 - counterDate.getDay()) % 7);
                        counterDate.setHours(21);
                        counterDate.setMinutes(0);
                        counterDate.setSeconds(0);
                    }
                }
                $(this).show().countdown(counterDate, function (event) {
                    $(this).find('._days').text(event.strftime('%D') || 0);
                    $(this).find('._hours').text(event.strftime('%H') || 0);
                    $(this).find('._minutes').text(event.strftime('%M') || 0);
                    $(this).find('._seconds').text(event.strftime('%S') || 0);
                }).on('finish.countdown', function () {
                    window.location = $(this).attr('redirect-url');
                });
            });
        });
    }
    $('[popupid]').on('click', function (e) {
        e.preventDefault();
        var popud = $(this).attr('popupid');
        if (popud.indexOf('pop') == -1) {
            popud = 'pop' + popud;
        }
        console.log('popud', popud);
        $('#' + popud).modal('show');
    });


    var vimeoVideoWrapper = '[data-title="vimeo-background-video"]';
    var vimeoBgPlayer = null;
    try {
        videoFrameSrc = $('iframe', vimeoVideoWrapper).attr('src');
        if (videoFrameSrc) {
            $('iframe', vimeoVideoWrapper).attr('src', videoFrameSrc);
            if (Vimeo) {
                vimeoBgPlayer = new Vimeo.Player($('iframe', vimeoVideoWrapper));
                vimeoBgPlayer.ready().then(function () {
                    $('.elVideo', vimeoVideoWrapper).next('iframe').remove();
                    $('.videoBlocker').on('click', function () {
                        $('.videoBlocker').hide();
                        vimeoBgPlayer.setVolume(1);
                        vimeoBgPlayer.setCurrentTime(0);
                        vimeoBgPlayer.play();
                    });
                });
            } else {
                console.log('Vimeo not loaded');
            }
        }
    } catch (e) {
        console.log(e);
    }
});
