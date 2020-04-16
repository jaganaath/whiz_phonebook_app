// API Gateway Endpoints
const $api_endpoint_base = "<<your_endpoint>>";
const $api_endpoint_resource = "<<your_endpoint>>";

// Get all contacts and display in table
$.getJSON( $api_endpoint_base, function( data ) {
    $all_contacts_dom = "";
    $no_records_text = "No records found";
    $(".dynamic_contact_fields").detach();
    if(data.Items.length > 1) {
    $.each( data.Items, function( key, val ) {      
        $all_contacts_dom += '<tr class="dynamic_contact_fields"><td style="width:30%">'+val.contactName+'</td><td>'+val.contactNumber+'</td><td><a href="#" onclick="deleteContact('+val.contactNumber+')">Delete</a></td></tr>';
     });
        $( $all_contacts_dom ).insertAfter( $( "#all_contacts_heading" ) );
    } else {
        $("<tr><td colspan='3'>" + $no_records_text + "</td></tr>").insertAfter( $( "#all_contacts_heading" ) );
    }
});

// Delete contact
function deleteContact(contactNumber) {
    $delete_data = '{"contactNumber":'+contactNumber+'}';
    $.ajax({
        url: $api_endpoint_resource,
        type: 'DELETE',
        data: $delete_data,
        contentType: 'application/json',
        success: function(result) {
            // Success
            alert("Succesfully deleted");
            location.reload(true); // Refresh page
        },
        error: function(request,msg,error) {
            // Error
            alert("Error deleting");
        }
    });
}

// Create Contact
function createContact(){
    $contact_number = $("#ph_number").val();
    $contact_name = $("#contact_name").val();

    // Make sure that its not empty
    if($contact_number.length ==0 || $contact_name.length ==0) {
        alert("Values can't be empty");
        return false;
    }
    $.ajax({
        url: $api_endpoint_base,
        type: 'POST',
        data: '{"contactNumber": '+$contact_number+', "contactName": "'+$contact_name+'"}',
        success: function(result) {
            // Success
            alert("Succesfully created");
            location.reload(true); // Refresh page
        },
        error: function(request,msg,error) {
            // Error
            alert("Error creating");
        }
    });
}

// Search Contact
function searchContact(){
    $search_contact = $("#search_contact_number").val();

    // Make sure that its not empty
    if($search_contact.length ==0){
        alert("Ener a contact number to search");
        return false;
    }
    // Display the search result table (empty at the moment without any data)
    $("#search_results").css("display", "inline-table");
    $.ajax({
        url: $api_endpoint_resource,
        type: 'GET',
        data: 'contactNumber='+$search_contact,
        success: function(data) {
            // Success
            $no_records_text = "No records found"; // Message to display when no records found
            $(".dynamic_result_fields").detach(); // Delete the existing DOM elements, so that we can insert new search result
            if(data.Item.contactName) {    
                // Build the DOM and insert the result
                $results_contact_dom = '<tr class="dynamic_result_fields"><td style="width:30%"><input type="text" id="search_contact_result" value="'+data.Item.contactName+'" placeholder="Enter contact name"/></td><td>'+data.Item.contactNumber+'</td><td><a href="#" onclick="updateContact()">Update</a> | <a href="#" onclick="deleteContact('+data.Item.contactNumber+')">Delete</a></td></tr>';
                $( $results_contact_dom ).insertAfter( $( "#search_results_heading" ) );
            } else {
                // When no records found
                $("<tr><td colspan='3'>" + $no_records_text + "</td></tr>").insertAfter( $( "#search_results_heading" ) );
            }
        },
        error: function(request,msg,error) {
            // Error
            $("#search_results").css("display", "none");
            alert("Error searching");
            return false;
        }
    });
}

// Clear search results
function clearSearchResults() {
    $("#search_results").css("display", "none");
}

// Update contact
function updateContact() {
    $contact_to_update = $("#search_contact_result").val();

    // Make sure that its not empty
    if($contact_to_update.length ==0){
        alert("Ener a contact name to update");
        return false;
    }
    $.ajax({
        url: $api_endpoint_resource,
        type: 'PUT',
        data: '{"contactNumber":345343434, "contactName": "'+$contact_to_update+'"}',
        success: function(data) {
            // Success
            alert("Contact updated successfully");
            location.reload(true); // Refresh page
        },
        error: function(request,msg,error) {
            // Error
            alert("Error updating contact");
            return false;
        }
    });
}
