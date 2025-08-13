var base_url;
var submitted = false;
var TokenReceived = false;
var global_form = null;
var domain = window.location.host.toLowerCase();
if (domain == 'web.clientore.com') {
    base_url = "https://api.clientore.com/";
} else if (domain == 'web.zybrzeus.com') {
    base_url = "https://api.zybrzeus.com/";
} else {
    base_url = "https://api.zybrzeus.com/";
}
// base_url = "http://localhost:3000/";

var previewMode = false;
if (typeof site_id !== 'undefined') {
    previewMode = window.location.hash == '#preview' || sessionStorage.getItem('previewMode_' + site_id) == '1';
    if (previewMode) {
        sessionStorage.setItem('previewMode_' + site_id, '1');
    } else {
        sessionStorage.removeItem('previewMode_' + site_id);
    }
}

function sa_ajax(action, data, done) {
    if (typeof _ref !== 'undefined') {
        data.user = _ref;
    }
    $.ajax({
        type: "POST",
        url: base_url + action,
        data: data,
        dataType: 'json'
    }).then(done);
}

function add_again(f, obj) {
    try {
        $(f).find('input[name="email"]').val(obj.email);
        $(f).find('.cc-number').val(obj.number);
        $(f).find('.expiry-year').val(obj.exp_year);
        $(f).find('.expiry-month').val(obj.exp_month);
        $(f).find('.cc-cvc').val(obj.cvc);
    } catch (e) {
        $(f).find('.cc-number, .expiry-year, .expiry-month, .cc-cvc').val('');
    }
}

function showLoading(msg) {
    Snackbar.show({
        pos: "bottom-center",
        text: msg || "Loading...",
    });
}

function showSuccess(msg) {
    Snackbar.show({
        pos: "bottom-center",
        text: msg || "Successfully Completed",
        backgroundColor: 'green',
        showAction: false,
    });
}

function showError(msg) {
    Snackbar.show({
        pos: "bottom-center",
        text: msg || "Something went wrong",
        backgroundColor: '#A50213',
        showAction: false,
    });
}

function showProcessing(msg) {
    $('body').append(`<div id="loadingDiv" class="processing-loader">
        <div class="processing-spinner"></div>
        <label class="processing-label">${msg || "Processing"}</label>
    </div>`);
}

function hideProcessing() {
    $("#loadingDiv").fadeOut(400, function () {
        $("#loadingDiv").remove();
    });
}

jQuery(document).ready(function ($) {

    "use strict";
    if ((window.location.origin.indexOf('web') != -1 || window.parent.location.origin.indexOf('web') != -1) && window.location.search != '?from=sys' && typeof site_id != 'undefined' && site_id && site_id != "{site_id}" && window.location.hash !== '#preview') {
        var visited = localStorage.getItem(site_id + "_v");
        if (!visited) {
            sa_ajax('leads/unique-visit', { s: site_id });
            localStorage.setItem(site_id + "_v", true);
        } else {
            sa_ajax('leads/visit', { s: site_id });
            localStorage.setItem(site_id + "_v", true);
        }
    }

    var b = $('.lightbox, .button-fullsize, .fullsize');
    if (b.length > 0) {
        b.fancybox({
            padding: 0,
            margin: 0,
            maxHeight: '90%',
            maxWidth: '90%',
            loop: true,
            fitToView: false,
            mouseWheel: false,
            autoSize: false,
            closeClick: false,
            overlay: { showEarly: true },
            helpers: { media: {} }
        });
    }

    $('a[href*=#section]').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({ scrollTop: targetOffset }, 1000);
                return false;
            }
        }
    });

    $('a[href*=#href]').live("click", function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({ scrollTop: targetOffset - 100 }, 1000);
                return false;
            }
        }
    });

    $('a[href*=#popup_]').live("click", function () {
        var pix_over = 'rgba(0,0,0,0.5)';
        if ($(this.hash).attr('pix-overlay')) {
            pix_over = $(this.hash).attr('pix-overlay');
        }
        var pix_class = '';
        if ($(this.hash).attr('pix-class')) {
            pix_class = $(this.hash).attr('pix-class');
        }
        this.overlay = pix_over;
        $.fancybox({
            href: this.hash,
            wrapCSS: 'firas',
            closeSpeed: 150,
            helpers: {
                overlay: {
                    closeClick: false,
                    speedOut: 200,
                    showEarly: true,
                    css: { 'background': pix_over },
                    locked: true
                },
                title: {
                    type: 'float'
                }
            },
            tpl: {
                wrap: '<div class="fancybox-wrap " tabIndex="-1"><div class="fancybox-skin container  ' + pix_class + '"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                closeBtn: '<a href="javascript:;" class="active_bg_close close_btn"><i class="pi pixicon-cross2"></i></a>',
            }
        });
        return false;
    });

    $('#gototop').click(function (e) {
        jQuery('html, body').animate({ scrollTop: 0 }, 750, 'linear');
        e.preventDefault();
        return false;
    });

    $("form.pix_paypal").live("submit", function (e) {
        var theform = this;
        var proceed = true;
        $("input, textarea, select").css('border-color', '');
        $.each($(theform).serializeArray(), function (i, field) {
            var is_required = $(theform).find('[name=' + field.name + ']').attr('required');
            if (field.value == "" && is_required) {
                $(theform).find('input[name=' + field.name + ']').css('border-color', 'red');
                $(theform).find('textarea[name=' + field.name + ']').css('border-color', 'red');
                $(theform).find('select[name=' + field.name + ']').css('border-color', 'red');
                proceed = false;
            }
        });
        if (!proceed) {
            e.preventDefault();
            return false;
        }
    });

    if (sessionStorage.getItem('cc')) {
        add_again($(this), JSON.parse(sessionStorage.getItem('cc')));
    }

    $('.pix_text, .pix_button').click(function (e) {
        if ($(this).attr('trip-wire') == '1' && $(this).attr('trip-wire-amount')) {
            e.preventDefault();
            const amount = $(this).attr('trip-wire-amount');
            const isLast = $(this).attr('trip-wire-is-last');
            const redirectUrl = $(this).attr('href');
            const tripWire = JSON.parse(localStorage.getItem('tripWire'));
            if (!tripWire) return showError("TripWire Record Not Found or Finished");
            showProcessing();
            sa_ajax('leads/tripwire/' + tripWire.id, {
                site_id,
                amount,
                email: tripWire.email,
                previewMode,
            }, function (res) {
                hideProcessing();
                if (res.status) {
                    showSuccess(res.message);
                    if (isLast == '1') localStorage.removeItem('tripWire');
                    if (redirectUrl) setTimeout(() => window.location.href = redirectUrl, 2000);
                } else {
                    if (res.message == "Invalid Site") localStorage.removeItem('tripWire');
                    showError(res.message);
                }
            });
        }
    });

    $("form").on("submit", function (e) {
        var values = {};
        var theform = this;
        global_form = theform;
        var proceed = true;
        if (submitted) {
            return;
        }
        if ($(this).hasClass('pix_paypal') && $(this).find('[type="text"], [type="email"]').length == 0) {
            return;
        }
        if ($(this).hasClass('stripe-form') && !TokenReceived && typeof Stripe != 'undefined' && typeof __spk != 'undefined') {
            e.preventDefault();
            init_stripe($(this));
            return;
        }
        e.preventDefault();

        $("input, textarea, select").css("border-color", "");
        $.each($(theform).serializeArray(), function (i, field) {
            try {
                values[(field.name || "other").replace(/ /g, "_")] = field.value;
                var is_required = $(theform)
                    .find(`[name="${field.name}"]`)
                    .attr("required");
                if (field.value == "" && is_required) {
                    $(theform)
                        .find(`input[name="${field.name}"]`)
                        .css("border-color", "red");
                    $(theform)
                        .find(`textarea[name="${field.name}"]`)
                        .css("border-color", "red");
                    $(theform)
                        .find(`select[name="${field.name}"]`)
                        .css("border-color", "red");
                    proceed = false;
                }
            } catch (e) {
                console.log("[ERROR]:", e.message);
            }
        });

        if (proceed) {
            TokenReceived = false;
            var output;
            values.s = site_id;
            values.f = $(theform).attr('name');
            var key = 'lead_' + site_id;
            if ($(theform).attr('data-is-first-step') == 1) {
                localStorage.removeItem(key);
            } else {
                values.lead_id = localStorage.getItem(key);
            }
            values.group_for_form = $(theform).attr('group-for-form');
            values.ar_for_form = $(theform).attr('ar-for-form');
            values.whatsapp_check = $('#whatsapp_c').attr('checked');
            values.messenger_check = $('#messenger_c').attr('checked');
            values.tripWire = $(theform).attr('trip-wire');
            values.previewMode = previewMode;
            if ($(theform).attr('multi-payment-option')) {
                values.multiPaymentOption = true;
                values.paymentFormId = $(theform).find('input[name="multiple_payment_select"]:checked').val();
            }
            showProcessing();
            sa_ajax('leads', values, function (response) {
                hideProcessing();
                if (!response.success) {
                    output = '<div class="error">' + response.msg + '</div>';
                    global_form = null;
                } else {
                    try {
                        // let f_name = values.name.split(' ')[0];
                        // let l_name = values.name.substring(f_name.length).trim();
                        // localStorage.setItem('formData', JSON.stringify({
                        //     first_name: f_name,
                        //     last_name: l_name,
                        //     email: values.email,
                        //     country: values.country,
                        //     phone: values.phone || values.number || values.mobile,
                        // }));
                    } catch (e) { console.log("ERROR: " + e.message) }

                    if (response.tripWire) localStorage.setItem("tripWire", JSON.stringify(response.data));
                    if ($(theform).attr('data-is-first-step') == 1 && response.lead_id) localStorage.setItem(key, response.lead_id);
                    trackFB('Lead', { page: $('title').text() });
                    var msg = 'Submitted Successfully.';
                    if ($(theform).data('msg')) {
                        msg = $(theform).data('msg');
                    } else if (response.msg) {
                        msg = response.msg;
                    }
                    var url = null;
                    if ($(theform).data('redirect')) {
                        url = $(theform).data('redirect');
                    } else if (typeof response.redirect_url != 'undefined') {
                        url = response.redirect_url
                    }
                    if (url) {
                        setTimeout(() => window.location.href = url, 2000);
                    }
                    output = '<div class="success">' + msg + '</div>';
                    if ($(theform).hasClass('pix_paypal')) {
                        submitted = true;
                        $(theform).find('[type="submit"]').click();
                        $(theform).submit();
                        return;
                    }
                    $(theform).find('input:not([type="checkbox"], [type="radio"], #__amount, .donotreset)').val('');
                    $(theform).find('input').css('border-color', '');
                    $(theform).find('textarea').val('');
                    global_form = null;
                }
                $(theform).find('#result').hide().html(output).slideDown();
            });
        }
    });

    $("input, textarea, select").keyup(function () {
        $(this).css('border-color', '');
        $('#result').slideUp();
    });

    $('select').change(function () {
        $(this).css('border-color', '');
        $('#result').slideUp();
    });

    $('input[type=radio][name=multiple_payment_select]').change(function () {
        var __v = $(this).attr("data-amount") || "0";
        $('#__amount').val(__v);
        CalculateAmount($(this).closest("form"));
    });

    var shown = false;
    $(document).mouseleave(function () {
        if (!shown) {
            $("#exit__popup").modal("show");
            shown = true;
        }
        return "";
    });

    initPayPalButton();
});


// Inline
(function (e) {
    e.fn.inlineStyler = function (t) {
        var n = e.extend({
            propertyGroups: {
                "*": ["border", "border-radius", "box-shadow", "height", "margin", "padding", "width", "max-width", "min-width", "border-collapse", "border-spacing", "caption-side", "empty-cells", "table-layout", "direction", "font", "font-family", "font-style", "font-variant", "font-size", "font-weight", "letter-spacing", "line-height", "text-align", "text-decoration", "text-indent", "text-overflow", "text-shadow", "text-transform", "white-space", "word-spacing", "word-wrap", "vertical-align", "color", "background", "background-color", "background-image", "background-position", "background-repeat", "Opacity", "bottom", "clear", "clip", "cursor", "display", "float", "left", "opacity", "outline ", "overflow", "position", "resize ", "right", "top", "visibility", "z-index", "list-style-image", "list-style-position", "list-style-type"],
                block: ["margin", "padding"]
            },
            elementGroups: { "*": ["A", "ABBR", "ACRONYM", "ADDRESS", "APPLET", "AREA", "ARTICLE", "ASIDE", "AUDIO", "B", "BASE", "BASEFONT", "BDI", "BDO", "BIG", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "CENTER", "CITE", "CODE", "COL", "COLGROUP", "COMMAND", "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIALOG", "DIR", "DIV", "DL", "DT", "EM", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FONT", "FOOTER", "FORM", "FRAME", "FRAMESET", "H1", "HEAD", "HEADER", "HR", "HTML", "I", "IFRAME", "IMG", "INPUT", "INS", "KBD", "KEYGEN", "LABEL", "LEGEND", "LI", "LINK", "MAP", "MARK", "MENU", "META", "METER", "NAV", "NOFRAMES", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION", "OUTPUT", "P", "PARAM", "PRE", "PROGRESS", "Q", "RP", "RT", "RUBY", "S", "SAMP", "SCRIPT", "SECTION", "SELECT", "SMALL", "SOURCE", "SPAN", "STRIKE", "STRONG", "STYLE", "SUB", "SUMMARY", "SUP", "TABLE", "TBODY", "TD", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR", "TRACK", "TT", "U", "UL", "VAR", "VIDEO", "WBR"] }
        }, t);
        this.each(function (t, r) {
            for (var i in n.elementGroups) {
                for (var s = 0, o = n.elementGroups[i].length; s < o; s++) {
                    var u = e(this).find(n.elementGroups[i][s]);
                    u.each(function () {
                        var r = '';
                        if (e(this).attr("style")) {
                            var t = e(this).attr("style");
                            r = t.split(";")
                        } else {
                            r = []
                        }
                        for (var s = 0, o = n.propertyGroups[i].length; s < o; s++) {
                            var u = n.propertyGroups[i][s];
                            if (e(this).css(u)) {
                                r.push(u + ":" + e(this).css(u))
                            }
                        }
                        e(this).attr("style", r.join(";")).removeAttr('class');
                    })
                }
            }
        })
    };

    if ($().datetimepicker) {
        $(".s_datetimepicker").attr('autocomplete', 'off').datetimepicker({
            format: 'mm/dd/yyyy HH:ii',
            autoclose: true,
        });
    }

})(jQuery);

if (window.location.search == "?sendHTML") {
    var b = $('html').find('body');
    b.inlineStyler();
    window.parent.getData(b.html())
}

function init_stripe(f) {
    if (!f) return;

    showProcessing();
    const cleanNumber = (txt) => `${txt}`.replace(/[^\d]/g, '').replace(/ /, '').toString();
    const number = cleanNumber(f.find('.cc-number').val());
    const cvc = cleanNumber(f.find('.cc-cvc').val());
    const exp_month = f.find('.expiry-month').val();
    const exp_year = f.find('.expiry-year').val();
    const cardInfo = { number, cvc, exp_month, exp_year };
    const createRequest = () => {
        Stripe.createToken(cardInfo, function (status, response) {
            hideProcessing();
            if (response.error) {
                f.find('#result').hide().html('<div class="error">' + response.error.message + '</div>').slideDown();
            } else {
                $('[name="amount"]').val(CalculateAmount(f));
                trackFB('Charged', { page: $('title').text() });
                // $(f).find('.cc-number, .expiry-year, .expiry-month, .cc-cvc').val('');
                $(f).find('[name="source"]').remove();
                $(f).append('<input type="hidden" name="source" value="' + response.id + '">');
                TokenReceived = true;
                f.submit();
                sessionStorage.setItem('cc', JSON.stringify(cardInfo));
            }
        });
    }

    try {
        if (typeof site_owner !== 'undefined' && site_owner) {
            sa_ajax('public/stripe/' + site_owner, {}, function (data) {
                const key = previewMode && data.test_public_key ? data.test_public_key : data.public_k || __spk;
                Stripe.setPublishableKey(key);
                createRequest();
            });
            Stripe.setPublishableKey(site_owner.stripe_publishable_key);
        } else {
            // TODO: will be removed later
            Stripe.setPublishableKey(__spk);
            createRequest();
        }
    } catch (e) {
        Stripe.setPublishableKey(__spk);
        createRequest();
    }
}


function initPayPalButton() {
    try {
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'silver',
                layout: 'vertical',
                label: 'paypal',

            },

            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        "amount":
                        {
                            "currency_code": "USD",
                            "value": CalculateAmount(global_form),
                        }
                    }]
                });
            },

            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    if (details) {
                        const values = {
                            s: site_id,
                            first_name: details.payer.name.given_name,
                            last_name: details.payer.name.surname,
                            email: details.payer.email_address,
                            payment_id: details.id,
                            amount: details.purchase_units[0].amount.value,
                        };
                        if ($(theform).attr('group-for-form') != '') {
                            values.group_for_form = $(theform).attr('group-for-form');
                        }
                        if ($(theform).attr('ar-for-form') != '') {
                            values.ar_for_form = $(theform).attr('ar-for-form');
                        }
                        var theform = $(".stripe-form");
                        sa_ajax('leads', values, function (response) {
                            if (!response.success) {
                                output = '<div class="error">' + response.msg + '</div>';
                            } else {
                                var msg = 'Submitted Successfully.';
                                if ($(theform).data('msg')) {
                                    msg = $(theform).data('msg');
                                } else if (response.msg) {
                                    msg = response.msg;
                                }
                                var url = null;
                                if ($(theform).data('redirect')) {
                                    url = $(theform).data('redirect');
                                } else if (typeof response.redirect_url != 'undefined') {
                                    url = response.redirect_url
                                }
                                if (url) {
                                    window.location.href = url;
                                }
                                output = '<div class="success">' + msg + '</div>';
                                $(theform).find('input:not([type="checkbox"], [type="radio"], #__amount, .donotreset)').val('');
                                $(theform).find('input').css('border-color', '');
                                $(theform).find('textarea').val('');
                                global_form = null;
                            }
                            $(theform).find('#result').hide().html(output).slideDown();
                        });
                    }
                });
            },

            onError: function (err) {
                console.log(err);
            }
        }).render('#paypal-button-container');
        const el1 = document.getElementById("or_paypal_option");
        if (el1 && el1.style) {
            el1.style.display = "block";
        }
        const el2 = document.getElementById("multiple_payment_select");
        if (el2 && el2.style) {
            el2.style.display = "none";
        }
    } catch (e) {
        console.log("[ERROR]: ", e.message);
    }
}



function trackFB(title, data) {
    if (typeof fbq != "undefined" && fbq) {
        fbq('track', title, data ? JSON.stringify(data) : '');
    }
}

$('.addons input').on('click', function () {
    var f = $(this).parents('form');
    CalculateAmount(f);
});

function CalculateAmount(f) {
    var a = parseInt($(f).find('#__amount').val());
    $(f).find('.addons input').each(function () {
        if ($(this).is(':checked')) {
            var am = parseInt($(this).val());
            if (typeof am == 'number' && !isNaN(am)) {
                a += am;
            }
        }
    });
    // change total amount
    $(f).find('#totalAmount').text('$' + a);
    return a;
}


$(document).ready(function () {

    var d = $(document);
    var ti = d.find('.tabs').find('li:first-child');
    d.find('.tabs').find('li').removeClass('active');
    ti.addClass('active');
    d.find('.tab-content .tab-item').hide();
    var c = d.find('[data-tab-name="' + ti.data('tab-target') + '"]');
    c.addClass('active').show();

    var form = d.find('#contact_form');
    if ($(form).attr('whatsapp-check') == 1) {
        d.find('#whatsapp_check').css('display', 'block');
    } else {
        d.find('#whatsapp_check').css('display', 'none');
    }
    if ($(form).attr('messenger-check') == 1) {
        d.find('#messenger_check').css('display', 'block');
    } else {
        d.find('#messenger_check').css('display', 'none');
    }

    // if (localStorage.getItem('formData')) {
    //     let formData = JSON.parse(localStorage.getItem('formData'));
    //     var name = formData.first_name + ' ' + formData.last_name;
    //     d.find('#name').val(name);
    //     d.find('input[name="name"]').val(name);
    //     d.find('#email').val(formData.email);
    //     d.find('input[name="email"').val(formData.email);
    //     d.find('#phone').val(formData.phone);
    //     d.find('#mobile').val(formData.phone);
    //     d.find('#number').val(formData.phone);
    //     d.find('#country').val(formData.country);
    // }

    $('[data-tab-target]').on('click', function (e) {
        var valid = true;
        var errorShown = false;
        var tab = $(this).data('tab-validate-fields');
        if ($(this).data('tab-validate-fields') != '') {
            d.find('[data-tab-name="' + $(this).data('tab-validate-fields') + '"]').parent().find('input[required]').each(function (e) {
                var name = $(this).attr('name');
                if (name && $(this).val() == "" && !errorShown) {
                    valid = false;
                    errorShown = true;
                    alert($(this).attr('name') + ' is a required field');
                }
            });
        }
        if (valid) {
            d.find('[data-tab-name]').hide();
            d.find('[data-tab-name="' + $(this).data('tab-target') + '"]').show();
            d.find('[data-tab-target]').removeClass('active');
            d.find('[data-tab-target], [data-tab-name]').removeClass('active');
            d.find('[data-tab-target="' + $(this).data('tab-target') + '"]').addClass('active');
        }
    });

    window.addEventListener('message', function (event) {
        if (event.data) {
            var selector;
            switch (event.data.type) {
                case 'iframe-height':
                    selector = event.data.selector || '#appointmentCalendar';
                    $(document).find(selector).animate({
                        height: event.data.height
                    }, 200);
                    break;
                case 'do-redirect':
                    selector = event.data.selector;
                    if (selector && selector != '') {
                        var uri = $(document).find(selector).attr('data-redirect');
                        if (uri && uri != '') {
                            window.location.href = uri;
                        }
                    }
                    break;
            }
        }
    });

    $('.modal').on('hidden.bs.modal', function (e) {
        var iframe = $(this).find('iframe');
        if (iframe.length > 0) {
            var src = $(iframe).attr('src');
            src.replace('autoplay=1', '').replace('?&', '?');
            $(iframe).attr('src', src);
        }
        var video = $(this).find('video');
        if (video.length > 0) {
            video.each(function () {
                $(this).trigger('pause');
            });
        }
    });

    if (previewMode) {
        $('body').append(`<img width="180" style="position:sticky; bottom:0;" src="https://pngimage.net/wp-content/uploads/2018/06/preview-png.png" />`);
    }
});
