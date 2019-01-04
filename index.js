let throwError = error => { throw new Error(error)}

let loading = async input => await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
        urlInput: input
    })
})
    .then(res => res.ok ? res : throwError(`${res.status},${res.statusText}` ))
    .then(data => data.blob())
    .then(data => {
        let downloadTag = document.createElement('a')
        downloadTag.target = '_blank'
        downloadTag.download = 'save.pdf'
        let newBlob = new Blob([data], {
            type: "application/pdf"
        })
        let thisData = window.URL.createObjectURL(newBlob)
        downloadTag.href = thisData
        downloadTag.click()
    })
    .catch(error => {
        console.log(error)
    })

document.getElementById('urlForm').addEventListener('submit',(e)=>{
    var urlInput = e.target.querySelectorAll('input#urlInput')[0].value
    e.preventDefault()
    loading(urlInput)
})