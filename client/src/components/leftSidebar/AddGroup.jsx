import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddGroup() {
 
  const navigate = useNavigate();

 
  function addGroupLink() {
   
    navigate('/addGroupLink'); 
  }

  return (
    <div class="add-contact-button" onClick={addGroupLink} id="addgroupButton">
      AddGroup
    </div>
  );
}
