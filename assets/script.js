

async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works/');
    const works = await response.json();
    return works;
}

const works = await fetchWorks();
console.log(works);
