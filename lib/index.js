'use strict';

(function (_) {

    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return;
    }

    // prefill
    store.set('id1', { subject: 'marcus', description: 'javascript' });
    store.set('id2', { subject: 'blubber', description: 'javascript' });

    tasksWrite($('#content'), store.getAll());
})();

$('#task-add').on('submit', function (e) {
    var id = 'id1';
    var tmp = {};
    var $content = $('#content');

    e.preventDefault();

    try {
        $(e.target).find('.form-control').each(function (i, el) {
            if (!el.value) {
                throw new Exception();
            }
            tmp[el.name] = el.value;
            el.value = '';
        }).end().find('input[name=key]').each(function (i, el) {
            if (!el.value || el.value === 'new') {
                id = 'id' + (getMaxId($content) + 1);
            } else {
                id = el.value;
            }
        });

        store.set(id, tmp);
        tasksWrite($content, store.getAll());
        $('#overlay-set').modal('hide');
    } catch (e) {
        return;
    }
});

$('#task-delete').on('submit', function (e) {
    e.preventDefault();

    try {
        $(e.target).find('input[name=key]').each(function (i, el) {
            if (!el.value) {
                throw new Exception();
            }
            if (el.value === 'all') {
                store.clear();
            } else {
                store.remove(el.value);
            }
            el.value = '';
        });

        tasksWrite($('#content'), store.getAll());
        $('#overlay-delete').modal('hide');
    } catch (e) {
        return;
    }
});

$('#overlay-delete, #overlay-set').on('show.bs.modal', function (e) {
    var key = $(e.relatedTarget).data('whatever');
    var task = store.get(key) || {};

    $(e.target).find('input[name=key]').val(key).end().find('.form-control').each(function (i, el) {
        if (task[el.name]) {
            el.value = task[el.name];
        }
    });
});

$('[data-dismiss=modal]').on('click', function (e) {
    $(e.target).parentsUntil('.modal-dialog', '.modal-content').find('.form-control').each(function (i, el) {
        $(el).val('');
    });
});

function tasksWrite($el, tasklist) {
    if (Object.keys(tasklist).length) {
        $('#empty', $el).addClass('hidden');
    } else {
        $('#empty', $el).removeClass('hidden');
    }

    tasksClear($el);

    $.each(tasklist, function (i, el) {
        $el.append('<article id="' + i + '" class="panel panel-default">\n    <header class="panel-heading clearfix">\n        <div class="btn-group pull-right">\n            <button type="button" class="btn btn-sm" data-whatever="' + i + '" data-toggle="modal" data-target="#overlay-set">Edit</button>\n            <button type="button" class="btn btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>\n            <ul class="dropdown-menu">\n                <li><button type="button" class="btn btn-sm btn-link" data-whatever="' + i + '" data-toggle="modal" data-target="#overlay-delete">Delete</button></li>\n            </ul>\n        </div>\n        <h2 class="panel-title">' + el.subject + '</h2>\n    </header>\n\n    <section class="panel-body">\n        ' + el.description + '\n    </section>\n</article>');
    });
}

function tasksClear($el) {
    $('.panel', $el).remove();
}

function getMaxId($el) {
    var ids = [0];

    $('.panel', $el).each(function (i, el) {
        ids.push(el.id.substring(2));
    });

    return Math.max.apply(Math, ids);
}