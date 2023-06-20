(async () => {
    await new Promise(() => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://apee.top')
        xhr.send()
        xhr.addEventListener('readystatechange', () => {
            console.log(xhr.readyState, xhr.status)
        })
    })
})()