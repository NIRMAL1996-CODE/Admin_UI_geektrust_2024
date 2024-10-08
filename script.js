//local storage//
localStorage.removeItem('userdata');
const UserData = "userdata";

//fetching data and handling local storage//
//import APIurl from config.js
import { APIurl } from "./config.js"; //import api url
let p= fetch(APIurl);
p.then((response)=>{
    if(!response.ok)
        throw new Error("Network response is not ok"+response.statusText);
    else
return response.json();
}).then((data)=>{
    // Check if there's data in local storage
    let storedData = localStorage.getItem(UserData);
    if (storedData) {
        data = JSON.parse(storedData); // Use data from local storage if available
    } else {
        localStorage.setItem(UserData, JSON.stringify(data)); // Store fetched data in local storage
    }
    adminUI(data);
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

    //create a function to delete rows
    function deleteUser(user, data, row){
       row.remove(); // Remove the row from the table
       data=data.filter(u => u.id !== user.id); // Update the data
       localStorage.setItem(UserData, JSON.stringify(data)); // Update local storage
       createRows(data);
     }

     // Add event to delete button for this row
     const deleteButton = row.querySelector('.del-btn');
     deleteButton.addEventListener('click', () => {
        deleteUser(user, data, row) 
    });
    
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data)); // Update local storage
    }
      
    // Add event to edit button for this row
    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
    editrows(user, row);
    });
  });
};
   createRows(data);//call createrow()function to create rows in table//

//adding event to search button
searchbutton.addEventListener("click",()=>{
    const searchword= searchText.value.toLowerCase(); //.value is used retrieves the current text entered in the input field.
    const filteredData= data.filter((user)=>{
    const field =[user.id,user.name,user.email,user.role];
    return field.some(field=>field.toLowerCase().includes(searchword));
 });
  if(filteredData.length===0)
    alert("No Matches Found, Try Again")
   else
    createRows(filteredData);
  });
 
   //events to checkboxes
   selectALLcheckbox.addEventListener("change",()=>{
   const rowcheckbox= document.querySelectorAll(".rowcheckbox");
   rowcheckbox.forEach((checkbox)=>{
   checkbox.checked = selectALLcheckbox.checked;
     });
   });

//create pagination 
   const itemsInPage= 10;
   let currentPage= 1;
   const totalPages= Math.ceil(data.length/ itemsInPage);
   const displayPage= (page)=>{
      const start= (currentPage-1)*itemsInPage;
      const end= start+itemsInPage;
      const paginatedData= data.slice(start,end);//till here sliced the data, that send to createrows(), which than show rows
      createRows(paginatedData);

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
if(currentPage<totalPages)
currentPage++;
selectALLcheckbox.checked = false; 
displayPage(currentPage);
});

lastPage.addEventListener("click",()=>{
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
localStorage.setItem(UserData, JSON.stringify(data)); // Update local storage
};
const del =document.querySelector(".deleteselected");
del.addEventListener("click",deleteselected);
}
