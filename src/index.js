(_ => {

    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return;
    }

    // prefill
    // store.set('id1', { subject: 'marcus', description: 'javascript' });
    // store.set('id2', { subject: 'blubber', description: 'javascript' });

    tasksWrite($('#content'), store.getAll())

})()



$('#task-add').on('submit', e => {
    let id = 'id1'
    let tmp = {}
    let $content = $('#content')

    e.preventDefault()

    try {
        $(e.target)
            .find('.form-control')
            .each((i, el) => {
                if (!el.value) {
                    throw new Exception()
                }
                tmp[el.name] = el.value
                el.value = ''
            })
            .end()
            .find('input[name=key]')
            .each((i, el) => {
                if (!el.value || el.value === 'new') {
                    id = 'id' + (getMaxId($content) + 1)
                }
                else {
                    id = el.value
                }
            })

        store.set(id, tmp)
        tasksWrite($content, store.getAll())
        $('#overlay-set').modal('hide')
    }
    catch (e) {
        return
    }
})

$('#task-delete').on('submit', e => {
    e.preventDefault()

    try {
        $(e.target)
            .find('input[name=key]')
            .each((i, el) => {
                if (!el.value) {
                    throw new Exception()
                }
                if (el.value === 'all') {
                    store.clear()
                }
                else {
                    store.remove(el.value)
                }
                el.value = ''
            })

        tasksWrite($('#content'), store.getAll())
        $('#overlay-delete').modal('hide')
    }
    catch (e) {
        return
    }
})

$('#overlay-delete, #overlay-set').on('show.bs.modal', e => {
    let key = $(e.relatedTarget).data('whatever')
    let task = store.get(key) || {}

    $(e.target)
        .find('input[name=key]')
        .val(key)
        .end()
        .find('.form-control')
        .each((i, el) => {
            el.value = task[el.name] || ''
        })
})

$('[data-dismiss=modal]').on('click', e => {
    $(e.target)
        .parentsUntil('.modal-dialog', '.modal-content')
        .find('.form-control')
        .each((i, el) => {
            el.value = ''
        })
})




function tasksWrite($el, tasklist) {
    if (Object.keys(tasklist).length) {
        $('#empty', $el).addClass('hidden')
    } else {
        $('#empty', $el).removeClass('hidden')
    }

    tasksClear($el)

    $.each(tasklist, (i, el) => {
        $el.append(
`<article id="${i}" class="panel panel-default">
    <header class="panel-heading clearfix">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm" data-whatever="${i}" data-toggle="modal" data-target="#overlay-set">Edit</button>
            <button type="button" class="btn btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
            <ul class="dropdown-menu">
                <li><button type="button" class="btn btn-sm btn-link" data-whatever="${i}" data-toggle="modal" data-target="#overlay-delete">Delete</button></li>
            </ul>
        </div>
        <h2 class="panel-title">${el.subject}</h2>
    </header>

    <section class="panel-body">
        ${el.description}
    </section>
</article>`)
    })
}

function tasksClear($el) {
    $('.panel', $el).remove()
}

function getMaxId($el) {
    let ids = [0]

    $('.panel', $el).each((i, el) => {
        ids.push(el.id.substring(2))
    })

    return Math.max(...ids)
}
