console.log('connecté !');

/*PSEUDO CODE : 
I.1 Display 3 entries of data per page

I.2 Build navigation and display dynamically navigable pages

I.3 Je style le numéro de page actif

II.Sort columns ascending or descending by ID, Name, Email Address, and Job Title

II.1 Tri ascendant par ID

III.When sorting ascending the top arrow in the table header will be a darker blue and the bottom arrow will be a lighter blue. You can update the style by adding a class of `ascending` to the `button`. 

IV.When sorting descending the bottom arrow in the table header will be a dark blue and the top arrow will be a lighter blue. You can update the style by adding a class of `descending` to the `button`.

V.Users can view the next page of data (if you’re not on the last page already) by clicking on the next arrow (bottom right).

VI.Users can view the previous page of data (if you’re not on the first page) by clicking on the previous arrow (bottom right).
*/

//I.1 : Je cache les rows que je ne veux pas voir

const table = document.querySelector('table')
console.log(table)

let rowsPerPage = 5
let currentPage = 1

const rows = document.querySelectorAll('.data-row')
console.log(rows)

function showRows(currentPage){//ma fonction prend en paramètre ma page actuelle et borne entre un index de début et un index de fin pour cacher le reste de conteni

    const startIndex = (currentPage - 1) * rowsPerPage//page-1 convertit le numéro de page (qui part de 1) en array index (part de 0) donc soustraire 1 aligne avec le correct index
    //rowsPerPage représente le nombre de rows à afficher sur chaque page donc multiplier (page-1)*rowsPerPage va calculer le nombre de rows a skipper

    const endIndex = startIndex + rowsPerPage

    rows.forEach((item, index) => {
        if (index >= startIndex && index < endIndex) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
}

//I.2 JE CONSTRUIS LA PAGINATION : Repartir du nombre total de rows. On fait un array contenant des paquets de 5 rows et pour chaque ajoute le <li> avec le numéro de page dedans

const arrayOfRows = Array.from(rows)//on convertit la NodeList rows en array pour pouvoir y accéder ensuite
console.log('arrayOfRows',arrayOfRows)

const groupedArray = []//je déclare en dehors de la fonction pour pouvoir y accéder après la fonction

function groupByThree(arrayOfRows) {
    
    for (let i=0; i < arrayOfRows.length; i = i+ rowsPerPage) {
        groupedArray.push(arrayOfRows.slice(i, i+ rowsPerPage))//fait un nouvel array avec en guise d'item les rows groupés par 5
    }
    console.log(groupedArray)
    return groupedArray
}

groupByThree(arrayOfRows)

const paginationPages = document.querySelector('.pagination-pages')


let counter = []//il me manque un compteur pour contenir les numéros de pages à chaque <tr> groupé par 3

function countEachGroupedArray(groupedArray){
    groupedArray.forEach((item, index)=>{//impératif d'utiliser forEach à chaque fois car permet de prendre en paramètre à la fois l'item et l'index. Ici j'accède à l'index et j'ajoute +1 chaque fois qu'un item est rencontré
        counter.push(index + 1)
    })
    console.log('page counter', counter)
    return counter
}
countEachGroupedArray(groupedArray)

groupedArray.forEach((item) => {
    paginationPages.innerHTML +=
    `
    <li></li>
    `
})

//Create pagination using my <li> elemnts
const paginationItems = Array.from(document.querySelectorAll('.pagination-pages li'))

console.log(paginationItems)

paginationItems.forEach((item, index)=>{
    item.textContent = counter[index]//assigne un numéro de page correspondant au counter de page
    item.addEventListener('click', ()=>{
        if (!document.startViewTransition) {
            currentPage = index + 1;//toujours pareil index + 1 pour cette fois la currentPage sur l'index+1
            showRows(currentPage)//la valeur mise à jour de la currentPage est utilisée dans la fonction qui montre les rows
            styleNumeroDePageActif()
            return;
        }else{
            document.startViewTransition(() =>{//------------- VIEW TRANSITIONS
            currentPage = index + 1;//toujours pareil index + 1 pour cette fois la currentPage sur l'index+1
            showRows(currentPage)//la valeur mise à jour de la currentPage est utilisée dans la fonction qui montre les rows
            styleNumeroDePageActif()
        })
          }
        
    })
})

//I.3 Je style le numéro de page actif
function styleNumeroDePageActif(){
    paginationItems.forEach((item, index)=>{
        if(index+1 === currentPage){
            item.id = 'active'
        }else{
            item.id = ''
        }
    })
}

showRows(currentPage)//obligé d'appeler ça tout en bas pour que qlq chose s'affiche au lancement de la page, sans clic

//II.1 Tri descendant par ID

//j'ajoute d'abord l'icône de tri pour chaque table header
const tableHeaders = document.querySelectorAll('th')
console.log(tableHeaders)

tableHeaders.forEach((item)=>{
    const ascendingIcon = document.createElement('i')
    ascendingIcon.classList ='ph ph-sort-ascending'
    item.append(ascendingIcon)
})

//j'essaie de faire le tri ascendant au clic sur l'icone : avant même de pouvoir faire le tri je dois transformer mon arrayOfRows en objet contenant les paires key/value de chaque élement à l'intérieur du <tr>

const trElements = document.querySelectorAll('tr');

const detrElementsAUnObjet = Array.from(trElements).map((trElement) => {
  const tdElements = trElement.querySelectorAll('td[data-cell]');

  const chaqueTrDansUnObjet = {};

  tdElements.forEach((td) => {
    const key = td.getAttribute('data-cell');//va chercher chaque data-cell de chaque td et met l'attribut en guise de clé
    const value = td.textContent;

    if (key === 'id') {//pour chaque ID on convertit la string en number
      chaqueTrDansUnObjet[key] = parseInt(value); // Convert the string to a number
    } else {
      chaqueTrDansUnObjet[key] = value;
    }
  });

  return chaqueTrDansUnObjet;
});

console.log('detrElementsAUnObjet', detrElementsAUnObjet);


const ascendingIcons = document.querySelectorAll('.ph-sort-ascending');
console.log(ascendingIcons);



ascendingIcons.forEach((item) => {
  item.addEventListener('click', () => {
    detrElementsAUnObjet.sort((a, b) => {
      return b.id - a.id; // Sort in descending order (from big number to little number)
    });

    // Clear the existing table rows
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    // Add the sorted rows back to the table
    detrElementsAUnObjet.forEach((obj) => {
      const row = document.createElement('tr');

      // Create and append the table cells for each property in the object
      for (const key in obj) {
        const cell = document.createElement('td');
        cell.textContent = obj[key];
        row.appendChild(cell);
      }

      tableBody.appendChild(row);
    });
  });
});







