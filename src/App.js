import "antd/dist/antd.css";

import Header from "./components/home/subcomponents/Header";
import React, { useState, useEffect, Fragment } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import data from "./mock-data.json";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";



const filterPosts = (contacts, query, loc="", area="") => {
  if (!query && !loc && !area) {
    return contacts;
  }

  return contacts.filter((post) => {
    const postName = post.fullName.toLowerCase();
    const locationName = post.phoneNumber;
    const areaName = post.address;
    return  (postName.includes(query) && locationName.includes(loc) && areaName.includes(area))
  });
};

const App = () => {
  const [contacts, setContacts] = useState(data);
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    open: "",
    close: "",
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    open: "",
    close: "",
  });

  const [editContactId, setEditContactId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      id: nanoid(),
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      open: addFormData.open,
      close: addFormData.close,
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);

    var frm = document.getElementsByName('contact-form')[0];
   
   frm.reset(); 

  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      open: editFormData.open,
      close: editFormData.close,
    };

    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === editContactId);

    newContacts[index] = editedContact;

    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      Open: contact.open,
      close: contact.close,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === contactId);

    newContacts.splice(index, 1);

    setContacts(newContacts);
  };

  const { search } = window.location;

  const loc = new URLSearchParams(search).get("o");
  const [searchLoc, setSearchLoc] = useState(loc || "");

  const area = new URLSearchParams(search).get("a");
  const [searchArea, setSearchArea] = useState(area || "");
  
  const query = new URLSearchParams(search).get("s");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const filteredPosts = filterPosts(contacts, searchQuery, searchLoc, searchArea);

  return (
    <div>
      <Header />
      <div className="search">
      <input
        className="input"
        value={searchQuery}
        onInput={(e) => setSearchQuery(e.target.value)}
        type="text"
        id="header-search"
        placeholder="Search Shop Name"
        name="s"
      />

      <select
        name="o"
        showSearch
        value={searchLoc}
        className="input"
        optionFilterProp="children"
        onChange={(e) => setSearchLoc(e.target.value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <option value="">All Category</option>
        {contacts.map((i) => (
          <option value={i.phoneNumber}>{i.phoneNumber}</option>
        ))}
      </select>

      <select
        name="a"
        showSearch
        className="input"
        optionFilterProp="children"
        onChange={(e) => setSearchArea(e.target.value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <option value="">All Area</option>
        {contacts.map((i) => (
          <option value={i.address}>{i.address}</option>
        ))}
      </select>
</div>
      <form className="create-shop" onSubmit={handleAddFormSubmit} name="contact-form">
        <input
          className="input"
          type="text"
          name="fullName"
          required="required"
          placeholder="Shop Name"
          onChange={handleAddFormChange}
        />

        <select
          className="input"
          type="text"
          name="address"
          required="required"
          placeholder="Location"
          onChange={handleAddFormChange}
        >
          <option selected="true" disabled="disabled">
            Location
          </option>
          <option>Thane</option>
          <option>Pune</option>
          <option>Mumbai Suburban</option>
          <option>Nashik</option>
          <option>Nagpur</option>
          <option>Ahmednagar</option>
          <option>Solapur</option>
        </select>

        <select
          className="input"
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Shop Category"
          onChange={handleAddFormChange}
        >
          <option selected="true" disabled="disabled">
            Shop Category
          </option>
          <option>Grocery</option>
          <option>Butcher</option>
          <option>Baker</option>
          <option>Chemist</option>
          <option>Stationery</option>
          <option>Jewelry</option>
          <option>Clothes</option>
        </select>


        <input
          className="input"
          name="open"
          required="required"
          type="date"
          onChange={handleAddFormChange}
        />
        <input
          className="input"
          name="close"
          required="required"
          type="date"
          onChange={handleAddFormChange}
        />
        <button className="button" type="submit">
          Create Shop
        </button>
      </form>

      <form onSubmit={handleEditFormSubmit}>
        <table className="table">
          <thead className="table-head">
            <tr>
              <th>Shop</th>
              <th>Location</th>
              <th>Category</th>
              <th>Opening Date</th>
              <th>Closing Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredPosts.map((contact) => (
              <Fragment>
                {editContactId === contact.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
            
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default App;
