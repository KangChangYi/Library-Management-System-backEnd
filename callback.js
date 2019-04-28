
// Promise
// console.log("前");
// function getUser (id) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log("reading info... ");
//             resolve({ id, name: "kcy" });
//         }, 2000);
//     })
// }
// function getGitHubRepo (name) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(['rep1', 'rep2', 'rep3'])
//         }, 2000)
//     })
// }
// getUser(1)
//     .then(res => getGitHubRepo(res.name))
//     .then(res => console.log(res))
// console.log('后')


// async / await
console.log("前");
function getUser (id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("reading info... ");
            resolve({ id, name: "kcy" });
        }, 2000);
    })
}
function getGitHubRepo (name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['rep1', 'rep2', 'rep3'])
        }, 2000)
    })
}
// getUser(1)
//     .then(res => getGitHubRepo(res.name))
//     .then(res => console.log(res))
async function displayCommit () {
    const p = await getUser(1);
    const w = await getGitHubRepo(p);
    console.log(w)
}
displayCommit()
console.log('后')
