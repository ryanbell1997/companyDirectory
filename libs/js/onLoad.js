$(document).ready(() => {

    let tempFirstName = "";
    let tempLastName = "";
    let tempJobTitle = "";
    let tempDepartment = "";
    let tempEmail = "";
    let tempDepartmentID = 0;
    let tempEmployeeID = 0;

    let tempDeleteID = 0;

    let firstNameHeader = '';
    let lastNameHeader = '';
    let jobTitleHeader = '';
    let departmentIDHeader = '';
    let emailHeader = '';

    let tempDepartmentName = '';
    let tempDepartmentLocation = 0;
    let departmentNameHeader = '';
    let departmentLocationHeader = 0;

    let tempLocationName = '';
    let locationNameHeader = '';
    let tempLocationID = 0;
    
    function main() {
        GetRows();
        DepartmentFilters();
        LocationFilters();
    }

    function tableHTMLCreator(json){
        let returnHTML = '';
        for(let i = 0; i < json['data'].length; i++) {
            var firstName = json['data'][i]['firstName'];
            var lastName = json['data'][i]['lastName'];
            var jobTitle = json['data'][i]['jobTitle'];
            var email = json['data'][i]['email'];
            var location = json['data'][i]['location'];
            var department = json['data'][i]['department'];
            var employeeID =  json['data'][i]['id']

            returnHTML += `
            <tr>
                <td id="eID">${employeeID}</td>
                <td id="fN">${firstName}</td>
                <td id="lN">${lastName}</td>
                <td id="jT">${jobTitle}</td>
                <td id="eM"><i class="material-icons emailButton">email</i> ${email}</td>
                <td id="lO">${location}</td>
                <td id="dE">${department}</td>
                <td class="buttonContainer editCell"><i class="material-icons editButton">edit</i></td>
                <td class="buttonContainer deleteCell"><i class="material-icons deleteButton">delete</i></td>
            </tr>`
        }

        return returnHTML;
    }
    
    function GetRows(){
        $.ajax({
            url: "libs/php/getAll.php",
            type: "GET",
            dataType: "json",
            data: {},
                success: (result) => {
                    console.log(result);
                        $('#directory').html('');
                        $('#directory').append(tableHTMLCreator(result));
                        setLJSON('directoryRows', result);            
            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    function DepartmentFilters(){

        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            dataType: "json",
            data: {},
                success: (result) => {
                    setLJSON("departmentInfo", result);
                    $('#departmentSettingsList').html('');
                    for(let i = 0; i < result['data'].length; i++){
                        var option = `<option value=${result['data'][i]['id']}>${result['data'][i]['name']}</option>`
                        var input = `<div class="departmentInput"><li>${result['data'][i]['name']}</li><button class="btn btn-warning settingsButtons editDepartmentButton"id=${result['data'][i]['id']}><i class="material-icons">edit</i></button><button class="btn btn-danger settingsButtons deleteDepartmentButton" id=${result['data'][i]['id']}><i class="material-icons">delete</i></button></div>`;
                        $('#departmentFilter').append(option);
                        $('#departmentInput').append(option);
                        $('#departmentSettingsList').append(input);
                    }
                    if(!$('.addDepartmentRow').length){
                        $('#departmentSettingsList').prepend(`<div class="departmentInput addDepartmentRow"><li>Add New Department</li><button class="btn btn-success settingsButtons" id="addDepartment"><i class="material-icons">add</i></button></div>`)
                    }
                    
                    $('#addDepartment').on('click', () => {
                        $('#departmentSettingsModal').hide();
                        $('#departmentAmendModal').show();
                        $('#submitDepartment').show();
                        $('#departmentName').val('');
                        $('#departmentLocationSelector').val('');
                    })
                         
                    $('.editDepartmentButton').on('click', (e) => {
                        let departmentInfo = getLJSON("departmentInfo");
                        tempDepartmentID = $(e.target).attr("id");
                        tempDepartmentName = FindIDName(tempDepartmentID, departmentInfo);
                        tempDepartmentLocation = FindIDLocation(tempDepartmentID, departmentInfo);

                        $('#departmentName').val(tempDepartmentName);
                        $('#departmentLocationSelector').val(tempDepartmentLocation);

                        $('#departmentEditButton').show();
                        $('#departmentSettingsModal').hide();
                        $('#departmentAmendModal').show();
                    })

                    $('.deleteDepartmentButton').on('click', (e) => {
                        let departmentInfo = getLJSON("departmentInfo");
                        tempDepartmentID = $(e.target).attr("id");
                        tempDepartmentName = FindIDName(tempDepartmentID, departmentInfo);
                        HideModalFeatures();

                        $('#deleteModal').show();
                        $('#deleteCompleteSymbol').hide();
                        $('#yesDeleteDepartment').show();
                        $('#noDeleteDepartment').show();
                        $('#closeButton').hide();
                        $('#deleteText').html(`<p>Are you sure you would like to delete the <strong>${tempDepartmentName} department?</strong></p>`)


                    })

                    //This variable is for creating new id for any new added departments.
                    maxDepartmentID = Number(result['data'][result['data'].length - 1]['id']) + 1;
                    
                }, error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
        })
    }
    
    function LocationFilters(){
        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            dataType: "json",
            data: {},
                success: (result) => {
                    setLJSON("locationInfo", result);
                    let locationData = getLJSON("locationInfo", result);
                    $('#locationSettingsList').html('');

                    for(let i = 0; i < result['data'].length; i++){
                        var option = `<option value=${result['data'][i]['id']}>${result['data'][i]['name']}</option>`
                        var input = `<div class="locationInput"><li>${result['data'][i]['name']}</li><button class="btn btn-warning settingsButtons editLocationButton"id=${result['data'][i]['id']}><i class="material-icons">edit</i></button><button class="btn btn-danger settingsButtons deleteLocationButton" id=${result['data'][i]['id']}><i class="material-icons">delete</i></button></div>`;

                        $('#locationFilter').append(option);
                        $('#departmentLocationSelector').append(option);
                        $('#locationSettingsList').append(input);
                    }
                    if(!$('.addLocationRow').length){
                        $('#locationSettingsList').prepend(`<div class="locationInput addLocationRow"><li>Add New Department</li><button class="btn btn-success settingsButtons" id="addLocation"><i class="material-icons">add</i></button></div>`)
                    }

                    $('#addLocation').on('click', () => {
                        $('#locationSettingsModal').hide();
                        $('#locationAmendModal').show();
                        $('#submitLocation').show();
                        $('#locationName').val('');
                    });

                    $('.editLocationButton').on('click', (e) => {
                        let locationInfo = getLJSON("locationInfo");
                        tempLocationID = $(e.target).attr("id");;
                        tempLocationName = FindIDName(tempLocationID, locationInfo)

                        $('#locationName').val(tempLocationName);

                        $('#locationEditButton').show();
                        $('#locationSettingsModal').hide();
                        $('#locationAmendModal').show();
                    });

                    $('.deleteLocationButton').on('click', (e) => {
                        let locationInfo = getLJSON("locationInfo");
                        tempLocationID = $(e.target).attr("id");
                        tempLocationName = FindIDName(tempLocationID, locationInfo);
                        HideModalFeatures();

                        $('#deleteModal').show();
                        $('#deleteCompleteSymbol').hide();
                        $('#yesDeleteLocation').show();
                        $('#noDeleteLocation').show();
                        $('#closeButton').hide();
                        $('#deleteText').html(`<p>Are you sure you would like to delete the <strong>${tempLocationName} location?</strong></p>`)


                    })
                    
                }, error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
        })
    }

    function FindIDName(id, json){
        for(let i = 0; i < json['data'].length; i++){
            if(id == json['data'][i]['id']){
                return json['data'][i]['name'];
            }
        }
    }

    function FindIDLocation(id, json){
        for(let i = 0; i< json['data'].lenghth; i++) {
            if(id == json['data'][i]['id']){
                return json['data'][i]['name'];
            }
        }
    }

    function AddEmployee(){
        $.ajax({
            url: "libs/php/addEmployee.php",
            type: "POST",
            dataType: "json",
            data: {
                firstName: $('#firstNameInput').val(),
                lastName: $('#lastNameInput').val(),
                jobTitle: $('#jobTitleInput').val(),
                department: $('#departmentInput').val(),
                email: $('#emailInput').val()
            },
            success: (result) => {
                if(result['status']['code'] == 200){
                    $('#employeeForm').hide();
                    $('#successModal').show();
                    $('formButton').hide();
                    setTimeout(() => {
                        $('.modal').fadeToggle();
                    }, 2500);
                } else {
                    $('#employeeForm').hide();
                    $('#errorModal').show();
                    $('formButton').hide();
                    setTimeout(() => {
                        $('.modal').fadeToggle();
                    }, 2500);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    }

    function ClearDirectory(){
        $('#directory').html('');
    }

    function Search(){
        //TODO Create an onchange search function which will search through the names. Use cached JSON preferrably.
    }

    function DepartmentEditChangeChecker(){
        if(tempDepartmentName != $('#departmentName').val()){
            departmentNameHeader = $('#departmentName').val();
        } else {
            departmentNameHeader = tempDepartmentName;
        }

        if(tempDepartmentLocation != $('#departmentLocationSelector').val()){
            departmentLocationHeader = $('#departmentLocationSelector').val();
        } else {
            departmentLocationHeader =  tempDepartmentLocation;
        }
    }

    function LocationEditChangeChecker(){
        if(tempLocationName != $('#locationName').val()){
            locationNameHeader = $('#locationName').val();
        } else {
            locationNameHeader = tempLocationName;
        }
    }


    //Caching Functions
    function setLJSON(storageName,item) {
        localStorage.setItem(storageName, JSON.stringify(item));
    }
    
    function getLJSON(item) {
        return JSON.parse(localStorage.getItem(item));
    }
    
    function HideModalFeatures(){
        $('#editButton').hide();
        $('#formButton').hide();
        $('#successModal').hide();
        $('#errorModal').hide();
        $('#deleteModal').hide();
        $('#yesButton').hide();
        $('#noButton').hide();
        $('#employeeForm').hide();
        $('#settingsModal').hide();
        $('#departmentSettingsModal').hide();
        $('#locationSettingsModal').hide();
        $('#departmentAmendModal').hide();
        $('#departmentEditButton').hide();
        $('#submitDepartment').hide();
        $('#yesDeleteDepartment').hide();
        $('#noDeleteDepartment').hide();
        $('#locationSettingsModal').hide();
        $('#locationAmendModal').hide();
        $('#yesDeleteLocation').hide();
        $('#noDeleteLocation').hide();
        $('#locationEditButton').hide();
        $('#submitLocation').hide();
    }

    function PrepareAddForm(){
        HideModalFeatures();
        $('.modal').fadeToggle();
        $('#formButton').show();
        $('.modal-title').text('Add Employee');
        $('#firstNameInput').val('');
        $('#lastNameInput').val('');
        $('#jobTitleInput').val('');
        $('#emailInput').val('');
        $('#departmentInput').val(0);
        $('#employeeForm').show();
        $('#closeButton').show();
    }

    function PrepareEditForm(){
        HideModalFeatures();
        $('.modal').fadeToggle();
        $('#editButton').show();
        $('.modal-title').text('Edit Employee');
        $('#firstNameInput').val(tempFirstName);
        $('#lastNameInput').val(tempLastName);
        $('#jobTitleInput').val(tempJobTitle);
        $('#emailInput').val(tempEmail);
        $('#departmentInput').val(tempDepartmentID);
        $('#employeeForm').show();
        $('#closeButton').show();
    }

    function PrepareDeleteForm(){
        HideModalFeatures();
        $('#closeButton').hide();
        $('.modal-title').html('Delete Employee');
        $('#yesButton').show();
        $('#noButton').show();

    }

    function DepartmentIDConverter(department){
        switch(department){
            case "Human Resources":
                tempDepartmentID = 1;
                break;
            case "Sales":
                tempDepartmentID = 2;
                break;
            case "Marketing":
                tempDepartmentID = 3;
                break;
            case "Legal":
                tempDepartmentID = 4;
                break;
            case "Services":
                tempDepartmentID = 5;
                break;
            case "Research and Development":
                tempDepartmentID = 6;
                break;
            case "Product Management":
                tempDepartmentID = 7;
                break;
            case "Training":
                tempDepartmentID = 8;
                break;
            case "Support":
                tempDepartmentID = 9;
                break;
            case "Engineering":
                tempDepartmentID = 10;
                break;
            case "Accounting":
                tempDepartmentID = 11;
                break;
            case "Business Development":
                tempDepartmentID =  12;
                break;
        }
    }

    function FormChangeChecker(){
        if($('#firstNameInput').val() != tempFirstName){
            firstNameHeader = $('#firstNameInput').val();
        } else {
            firstNameHeader = tempFirstName;
        }

        if($('#lastNameInput').val() != tempLastName) {
            lastNameHeader = $('#lastNameInput').val();
        } else {
            lastNameHeader = tempLastName;
        }

        if($('#jobTitleInput').val() != tempJobTitle){
            jobTitleHeader = $('#jobTitleInput').val();
        } else {
            jobTitleHeader = tempJobTitle;
        }

        if($('#departmentInput').val() != tempDepartmentID){
            departmentIDHeader = $('#departmentInput').val();
        } else {
            departmentIDHeader = tempDepartmentID;
        }

        if($('#emailInput').val() != tempEmail){
            emailHeader = $('#emailInput').val();
        } else {
            emailHeader = tempEmail;
        }
    }

    function SetTempVars(arr){
        for(let i = 0; i < arr.length; i++){
            switch(arr[i]['id']){
                case "eID":
                    tempEmployeeID = arr[i]['innerHTML'];
                    break;
                case "fN":
                    tempFirstName = arr[i]['innerHTML'];
                    break;
                case "lN":
                    tempLastName =  arr[i]['innerHTML'];
                    break;
                case "jT":
                    tempJobTitle =  arr[i]['innerHTML'];
                    break;
                case "eM":
                    tempEmail = arr[i]['innerText'];
                    break;
                case "lO":
                    tempLocation = arr[i]['innerHTML'];
                    break;
                case "dE":
                    tempDepartment = arr[i]['innerHTML'];
                    break;
                default:
                    break;
            }
        }
    }

    //Event Listener
    $(".resetText").on('click', () => {
        $(".filterSelect").val("");
        ClearDirectory();
        $('#directory').append(tableHTMLCreator(getLJSON('directoryRows')));
    });

    $('#addButton').on('click', () => {
        PrepareAddForm();
    })

    $('#formButton').on('click', () => {
        AddEmployee();
        $('#formButton').hide();
        $('#closeButton').hide();
        GetRow();
    });

    $('.close').on('click', () => {
        $('.modal').fadeToggle();
    });

    $('#closeButton').on('click', () => {
        $('.modal').fadeToggle();
    });

    $("#departmentFilter").on('change', () => {
        if($("departmentFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/departmentFilter.php",
                method: "POST",
                data: {
                    id: $("#departmentFilter").val()
                },
                success: (result) => {
                    console.log(result)
                    ClearDirectory();
                    $('#directory').append(tableHTMLCreator(result));
                }, 
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                } 
            })
        }
    });

    $("#locationFilter").on('change', () => {
        if($("locationFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/locationFilter.php",
                method: "POST",
                data: {
                    id: $("#locationFilter").val()
                },
                success: (result) => {
                    console.log(result)
                    ClearDirectory();
                    $('#directory').append(tableHTMLCreator(result));
                }, 
                error: (errorText) => {
                    console.log(errorText);
                } 
            })
        }
    });

    //This event gets the event, creates an array that is the row and its children, and then assigns it temp variables for prepopulating the form.
    $('#directory').on('click', '.editCell', (e) => {    
        let parentInfo = $(e.target).parent().children().toArray();
        console.log(parentInfo);
        SetTempVars(parentInfo);

        const tagIndex = tempEmail.indexOf(' ');
        tempEmail = tempEmail.slice(tagIndex);
        DepartmentIDConverter(tempDepartment);

        PrepareEditForm();
    })
   
    //TODO Finish Update by adding an "Are you sure page"!
    $('#editButton').on('click', () => {
        FormChangeChecker();
        $.ajax({
            url: 'libs/php/editEmployee.php',
            type: 'POST',
            dataType: 'json',
            data: {
                firstName: firstNameHeader,
                lastName: lastNameHeader,
                jobTitle: jobTitleHeader,
                email: emailHeader,
                departmentID: departmentIDHeader,
                employeeID: tempEmployeeID,
            },
            success: (result) => {
                $('#employeeForm').hide();
                $('#editButton').hide();
                $('#successModal').show();
                $('#successText').html(`<p>${firstNameHeader} ${lastNameHeader} has been successfully updated!`);
                GetRows();
                setTimeout(() => {
                    $('.modal').fadeToggle();

                }, 2500);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    })

    $('#directory').on('click', '.deleteCell', (e) => {
        let parentInfo = $(e.target).parent().children().toArray();
        tempDeleteID = parentInfo[0]['innerHTML'];
        tempFirstName = parentInfo[1]['innerHTML'];
        tempLastName =  parentInfo[2]['innerHTML'];

        PrepareDeleteForm();
        $('.modal').fadeToggle();
        $('#deleteCompleteSymbol').hide();
        $('#deleteModal').show();
        $('#deleteText').html(`Are you sure you would like to delete <strong>${tempFirstName} ${tempLastName}</strong> from the directory?`);
    })
    
    //press yes to delete button
    $('#yesButton').on('click', () => {
        $.ajax({
            url: 'libs/php/deleteEmployee.php',
            type: 'POST',
            dataType: 'json',
            data: {
                employeeID: tempDeleteID, 
            },
            success: (result) => {
                $('#deleteText').html(`${tempFirstName} ${tempLastName} has been deleted successfully`);
                $('#yesButton').hide();
                $('#noButton').hide();
                $('#deleteCompleteSymbol').show();
                setTimeout(() => {
                    $('.modal').fadeToggle();
                }, 2500);
                GetRows();

            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })

    //Press no to escape delete button
    $('#noButton').on('click', () => {
        $('.modal').fadeToggle();
    })

    //opens settings page to select location or department settings.
    $('.settingsButton').on('click', () => {
        HideModalFeatures();
        $('.modal').fadeToggle();
        $('.modal-title').text("Settings")
        $('#settingsModal').show();
    });
    
    //Brings up department settings modal
    $('#departmentSettingsButton').on('click', () => {
        HideModalFeatures();
        DepartmentFilters();
        $('#departmentSettingsModal').show();

        
    })

    //Confirms department to be added.
    $('#submitDepartment').on('click', () => {
        $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                name: $('#departmentName').val(),
                locationID: $('#departmentLocationSelector').val(),
            },
            success: (result) => {
                $('#departmentAmendModal').hide();
                $('#submitDepartment').hide(); 
                DepartmentFilters();
                $('#successModal').show();
                $('#successText').text("Department successfully added!");
                setTimeout(() => {
                    $('#successModal').hide()
                    $('#departmentSettingsModal').show();
                }, 2500);
            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })

    //Confirms edit department.
    $('#departmentEditButton').on('click', () => {
        DepartmentEditChangeChecker();
        $.ajax({
            url: "libs/php/editDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                name: departmentNameHeader,
                locationID: departmentLocationHeader,
                departmentID: tempDepartmentID,
            },
            success: (result) => {
                HideModalFeatures();
                DepartmentFilters();
                GetRows();
                $('#successModal').show();
                $('#successText').text("Department successfully edited!");
                setTimeout(() => {
                    $('#successModal').hide();
                    $('#departmentSettingsModal').show();
                }, 2500);
            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })
    
    //Decline delete of department.
    $('#noDeleteDepartment').on('click', () => {
        HideModalFeatures();
        $('#departmentSettingsModal').show();
    })

    //Confirm delete of department.
    $('#yesDeleteDepartment').on('click', () => {
        $.ajax({
            url: "libs/php/deleteDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: tempDepartmentID,
            },
            success: (result) => {
                HideModalFeatures();
                DepartmentFilters();
                $('#successModal').show();
                $('#successText').text("Department successfully deleted!");
                setTimeout(() => {
                    $('#successModal').hide();
                    $('#departmentSettingsModal').show();
                }, 2500);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })

    $('#locationSettingsButton').on('click',() => {
        HideModalFeatures();
        LocationFilters();
        $('#locationSettingsModal').show();
    })

    $('#locationEditButton').on('click', () => {
        LocationEditChangeChecker();
        $.ajax({
            url: "libs/php/editLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                name: locationNameHeader,
                locationID: tempLocationID,
            },
            success: (result) => {
                HideModalFeatures();
                LocationFilters();
                $('#successModal').show();
                $('#successText').text("Location successfully edited!");
                setTimeout(() => {
                    $('#successModal').hide();
                    $('#locationSettingsModal').show();
                }, 2500);
            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })

    $('#noDeleteLocation').on('click', () => {
        HideModalFeatures();
        $('#locationSettingsModal').show();
    })

    $('#yesDeleteLocation').on('click', () => {
        $.ajax({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: tempLocationID,
            },
            success: (result) => {
                HideModalFeatures();
                LocationFilters();
                $('#successModal').show();
                $('#successText').text("Location successfully deleted!");
                setTimeout(() => {
                    $('#successModal').hide();
                    $('#locationSettingsModal').show();
                }, 2500);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })

    $('#submitLocation').on('click', () => {
        $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                name: $('#locationName').val(),
            },
            success: (result) => {
                $('#locationAmendModal').hide();
                $('#submitlocation').hide(); 
                LocationFilters();
                $('#successModal').show();
                $('#successText').text("Location successfully added!");
                setTimeout(() => {
                    $('#successModal').hide()
                    $('#locationSettingsModal').show();
                }, 2500);
            }, error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    })


    /* DO NOT HAVE THESE FILTERS AS OF RIGHT NOW.
    $("#managerFilter").on('change', () => {
        if($("managerFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/managerFilter.php",
                method: "POST",
                data: {
                    department: $("#managerFilter").val()
                },
                success: (result) => {
                    console.log(result);
                }, 
                error: (errorText) => {
                    console.log(errorText);
                } 
            })
        }
    });

    $("#positionFilter").on('change', () => {
        if($("positionFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/positionFilter.php",
                method: "POST",
                data: {
                    department: $("#positionFilter").val()
                },
                success: (result) => {
                    console.log(result);
                }, 
                error: (errorText) => {
                    console.log(errorText);
                } 
            })
        }
    });
*/
    main();
})
