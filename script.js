//local storage//
localStorage.removeItem('userdata');
const userData = "userdata";

//fetching data and handling local storage//
//import APIurl from config.js
import { userDataUrl } from "./config.js"; //import api url
let promise= fetch(userDataUrl);
promise.then((response)=>{
    if(!response.ok){
        throw new Error("Network response is not ok"+response.statusText);
    } else {
return response.json();
    }
}).then((fetcheddata)=>{
    // Check if there's data in local storage
    let storedData = localStorage.getItem(userData);
    if (storedData) {
      data = JSON.parse(storedData); // Use data from local storage if available
      adminUI(storedData);
    } else {
        localStorage.setItem(userData, JSON.stringify(fetcheddata)); // Store fetched data in local storage
        adminUI(fetcheddata);
    }
   
})
.catch((error)=>{
    console.error("There is an error: ", error);
});

 //this function contains all DOM_related code
 function adminUI(data){
const tablebody = document.querySelector(".tbody");
const searchbutton =document.querySelector(".searchbtn");
const searchText= document.querySelector(".search");
const selectALLcheckbox= document.querySelector(".selectAll");
const firstPage = document.querySelector("#firstpage");
const previousPage = document.querySelector("#previouspage");
const nextPage = document.querySelector("#nextpage");
const lastPage = document.querySelector("#lastpage");

//create the rows in table//
const createRows =(data)=>{
    tablebody.innerHTML='';//this is used to empty data from table//
    //loop for row for all users//
    data.forEach(user => {
       const row= document.createElement("tr");//create row element in table
       row.innerHTML=`
       <td><input type="checkbox" class="rowcheckbox"></td>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
        <td><button class="del-btn"><i class="fa-solid fa-trash"></i></button></td>`;
     tablebody.appendChild(row);

      // Add event to edit button for this row
    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
    editrows(user, row);
    });
       // Add event to delete button for this row
       const deleteButton = row.querySelector('.del-btn');
       deleteButton.addEventListener('click', () => {
          deleteUser(user, row); 
      });
   });
};
   createRows(data);//call createrow()function to create rows in table//

  // create a function to edit rows 
   function editrows(user, row){
    // Prompt user for new data
    const newName = prompt("Enter new name:", user.name);
    const newEmail = prompt("Enter new email:", user.email);
    const newRole = prompt("Enter new role:", user.role);
        
    // Update the user object
    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    if (newRole) user.role = newRole;

     // Update the row
    row.children[2].textContent = user.name; // Update name cell
    row.children[3].textContent = user.email; // Update email cell
    row.children[4].textContent = user.role; // Update role cell

     // save the updated data to localStorage
     let storedData = JSON.parse(localStorage.getItem(userData));
     const index = storedData.findIndex(u => u.id === user.id); // Find the index of the edited user
     storedData[index] = user; // Replace the old user with the updated one
    localStorage.setItem(userData, JSON.stringify(storedData)); // Update local storage
    }

    //create a function to delete rows
    function deleteUser(user, row){
    row.remove(); // Remove the row from the table
    let storedData = JSON.parse(localStorage.getItem(userData));
    storedData=storedData.filter(u => u.id !== user.id); // Update the data
    localStorage.setItem(userData, JSON.stringify(storedData)); // Update local storage

    const totalPages = Math.ceil(storedData.length / itemsInPage); // Recalculate totalPages after deletion
    createRows(storedData); // Re-render rows

    // Adjust pagination if needed after deletion
    if (currentPage > totalPages) {
        currentPage = totalPages; // Adjust to last page if deletion removes rows from the last page
    }
    displayPage(currentPage); //Update the current page display
    }
 
    //adding event to search button
    searchbutton.addEventListener("click",()=>{
    const searchword= searchText.value.toLowerCase(); //.value is used retrieves the current text entered in the input field.
    if (!searchword) {
        alert("Please enter a search term.");
        displayPage(1);
        return; // Stop if the search field is empty
    }

    let storedData = JSON.parse(localStorage.getItem(userData)); // Retrieve data from local storage
    const filteredData= storedData.filter((user)=>{         
    const field =[user.id,user.name,user.email,user.role];
       return field.some(field=>field.toLowerCase().includes(searchword));
    });

      if(filteredData.length===0){
        alert("No Matches Found, Try Again")
      } else{
        createRows(filteredData);
      }
  });
      // Events to checkboxes
      tablebody.addEventListener("change", (event) => {
        if (event.target.classList.contains("rowcheckbox")) {
            const row = event.target.closest("tr"); // Get the closest row for this checkbox
            if (event.target.checked) {
                row.classList.add('selected'); // Add class for selected rows
            } else {
                row.classList.remove('selected'); // Remove class for deselected rows
            }
        }
    });

   //events to checkboxes
   selectALLcheckbox.addEventListener("change",()=>{
   const rowcheckbox= document.querySelectorAll(".rowcheckbox");
   rowcheckbox.forEach((checkbox)=>{
   checkbox.checked = selectALLcheckbox.checked;
   const row = checkbox.closest("tr");
        if (checkbox.checked) {
            row.classList.add('selected'); // Add class for selected rows
        } else {
            row.classList.remove('selected'); // Remove class for deselected rows
        }
     });
   });

//create pagination 
   const itemsInPage= 10;
   let currentPage= 1;

   const displayPage= (page)=>{
    let storedData = JSON.parse(localStorage.getItem(userData)); // Get updated data from localStorage
      const start= (page-1)*itemsInPage;
      const end= start+itemsInPage;
      const paginatedData=storedData.slice(start,end);//till here sliced the data, that send to createrows(), which than show rows
      createRows(paginatedData);

   const totalPages= Math.ceil(storedData.length/ itemsInPage);
   firstPage.disabled = (currentPage === 1);
   previousPage.disabled = (currentPage === 1);
   nextPage.disabled = (currentPage === totalPages);
   lastPage.disabled = (currentPage === totalPages);

   const pagenumber= document.querySelector("#pageInfo");
   pagenumber.textContent = `Page ${currentPage} of ${totalPages}`;
};
displayPage(currentPage);

//add events to buttons.
firstPage.addEventListener("click",()=>{
currentPage=1;
selectALLcheckbox.checked = false; 
displayPage(currentPage);
});

previousPage.addEventListener("click",()=>{
if(currentPage>1)
currentPage--;
selectALLcheckbox.checked = false; 
displayPage(currentPage);
});

nextPage.addEventListener("click",()=>{
const totalPages = Math.ceil(JSON.parse(localStorage.getItem(userData)).length / itemsInPage);
if(currentPage<totalPages)
currentPage++;
selectALLcheckbox.checked = false; 
displayPage(currentPage);
});

lastPage.addEventListener("click",()=>{
const totalPages = Math.ceil(JSON.parse(localStorage.getItem(userData)).length / itemsInPage);
currentPage=totalPages;
selectALLcheckbox.checked = false; 
displayPage(currentPage);
});

//add events to deleteALLselected button
function deleteselected(){
const selectALLcheckboxes= document.querySelectorAll(".rowcheckbox:checked");
selectALLcheckboxes.forEach((checkbox)=>{
  const row= checkbox.closest("tr");
  const userId = row.children[1].textContent; 
  row.remove();
  data= data.filter(user => user.id !== userId);
});
localStorage.setItem(userData, JSON.stringify(data)); // Update local storage
};
const del =document.querySelector(".deleteselected");
del.addEventListener("click",deleteselected);
};
