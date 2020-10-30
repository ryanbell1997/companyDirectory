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
        PositionFilters();
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
            var fullName = firstName + " " + lastName;

            returnHTML += `
            <tr>
                <td id="eID">${employeeID}</td>
                <td id="inf"><i class="material-icons infoIcon" id=" ${employeeID}">info</i></td>
                <td id="fuN">${fullName}</td>
                <td id="fN">${firstName}</td>
                <td id="lN">${lastName}</td>
                <td id="jT">${jobTitle}</td>
                <td id="eM"><i class="material-icons emailButton">email</i> ${email}</td>
                <td id="lO">${location}</td>
                <td id="dE">${department}</td>
                <td class="buttonContainer"><i class="material-icons editButton editCell">edit</i></td>
                <td class="buttonContainer"><i class="material-icons deleteButton deleteCell">delete</i></td>
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
                        $('#directory').html('');
                        $('#directory').append(tableHTMLCreator(result));
                        setLJSON('directoryRows', result);            
            }, error: (jqXHR, textStatus, errorThrown) => {
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
                    $('#departmentInput').html('');
                    for(let i = 0; i < result['data'].length; i++){
                        var option = `<option value=${result['data'][i]['id']}>${result['data'][i]['name']}</option>`
                        var input = `<div class="departmentInput"><li>${result['data'][i]['name']}</li><button class="btn btn-warning settingsButtons"id=${result['data'][i]['id']}><i class="material-icons editDepartmentButton">edit</i></button><button class="btn btn-danger settingsButtons" id=${result['data'][i]['id']}><i class="material-icons deleteDepartmentButton">delete</i></button></div>`;
                        $('#departmentFilter').append(option);
                        $('#departmentInput').append(option);
                        $('#departmentSettingsList').append(input);
                    }
                    if(!$('.addDepartmentRow').length){
                        $('#departmentSettingsList').prepend(`<div class="departmentInput addDepartmentRow"><li>Add New Department</li><button class="btn btn-success settingsButtons"><i class="material-icons" id="addDepartment">add</i></button></div>`)
                    }
                    
                    $('#addDepartment').on('click', () => {
                        $('#departmentSettingsModal').hide();
                        $('#departmentAmendModal').show();
                        $('#submitDepartment').show();
                        $('#departmentName').val('');
                        $('#departmentLocationSelector').val('');
                    })
                         
                    $('.editDepartmentButton').on('click', (e) => {
                        LocationFilters();
                        tempDepartmentID = $(e.target).parent().attr("id");
                        tempDepartmentName = FindIDName(tempDepartmentID, result);
                        tempDepartmentLocation = FindIDLocation(tempDepartmentID, result);

                        $('#departmentName').val(tempDepartmentName);
                        $('#departmentLocationSelector').val(tempDepartmentLocation);

                        $('#departmentEditButton').show();
                        $('#departmentSettingsModal').hide();
                        $('#departmentAmendModal').show();
                    })

                    $('.deleteDepartmentButton').on('click', (e) => {
                        tempDepartmentID = $(e.target).parent().attr("id");
                        tempDepartmentName = FindIDName(tempDepartmentID, result);
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
                    $('#locationSettingsList').html('');
                    $('#departmentLocationSelector').html('');
                    for(let i = 0; i < result['data'].length; i++){
                        var option = `<option value=${result['data'][i]['id']}>${result['data'][i]['name']}</option>`
                        var input = `<div class="locationInput"><li>${result['data'][i]['name']}</li><button class="btn btn-warning settingsButtons"id=${result['data'][i]['id']}><i class="material-icons editLocationButton">edit</i></button><button class="btn btn-danger settingsButtons " id=${result['data'][i]['id']}><i class="material-icons deleteLocationButton">delete</i></button></div>`;

                        $('#locationFilter').append(option);
                        $('#departmentLocationSelector').append(option);
                        $('#locationSettingsList').append(input);
                    }
                    if(!$('.addLocationRow').length){
                        $('#locationSettingsList').prepend(`<div class="locationInput addLocationRow"><li>Add New Location</li><button class="btn btn-success settingsButtons"><i class="material-icons" id="addLocation">add</i></button></div>`)
                    }

                    $('#addLocation').on('click', () => {
                        $('#locationSettingsModal').hide();
                        $('#locationAmendModal').show();
                        $('#submitLocation').show();
                        $('#locationName').val('');
                    });

                    $('.editLocationButton').on('click', (e) => {
                        HideModalFeatures();
                        let locationInfo = getLJSON("locationInfo");
                        tempLocationID = $(e.target).parent().attr("id");;
                        tempLocationName = FindIDName(tempLocationID, locationInfo)

                        $('#locationName').val(tempLocationName);

                        $('#locationEditButton').show();
                        $('#locationSettingsModal').hide();
                        $('#locationAmendModal').show();
                    });

                    $('.deleteLocationButton').on('click', (e) => {
                        let locationInfo = getLJSON("locationInfo");
                        tempLocationID = $(e.target).parent().attr("id");
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

                }
        })
    }

    function PositionFilters(){
        $('#positionFilter').html('');
        $('#positionFilter').append(`<option value="" disabled selected>Filter position</option>`)
        GetRows();
        let data = getLJSON('directoryRows');
        let positionArray = [];
        for(let i = 0; i < data['data'].length; i++){
            if(!positionArray.includes(data['data'][i]['jobTitle'])){
                positionArray.push(data['data'][i]['jobTitle']);
            } else {
                continue;
            }
        }
        positionArray = positionArray.sort();
        for(let i = 0; i < positionArray.length; i++){
            var option = `<option value="${positionArray[i]}">${positionArray[i]}</option>`
            $('#positionFilter').append(option);
        }
    }

    function FindIDName(id, json){
        for(let i = 0; i < json['data'].length; i++){
            if(id == json['data'][i]['id']){
                return json['data'][i]['name'];
            }
        }
    }

    function FindIDLocation(id, json){
        for(let i = 0; i< json['data'].length; i++) {
            if(id == json['data'][i]['id']){
                return json['data'][i]['locationID'];
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
                    GetRows();
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

    function ValidateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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
        $('#infoModal').hide();
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

    $(".resetButton").on('click', () => {
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
        GetRows();
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
                    ClearDirectory();
                    $('#directory').append(tableHTMLCreator(result));
                }, 
                error: (jqXHR, textStatus, errorThrown) => {

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
                    ClearDirectory();
                    $('#directory').append(tableHTMLCreator(result));
                }, 
                error: (errorText) => {
                } 
            })
        }
    });

    //This event gets the event, creates an array that is the row and its children, and then assigns it temp variables for prepopulating the form.
    $('#directory').on('click', '.editCell', (e) => {    
        let parentInfo = $(e.target).parent().parent().children().toArray();
        SetTempVars(parentInfo);

        const tagIndex = tempEmail.indexOf(' ');
        tempEmail = tempEmail.slice(tagIndex);
        DepartmentIDConverter(tempDepartment);

        PrepareEditForm();
    })

    $('#editButton').on('click', () => {
        if(!ValidateEmail($('#emailInput').val())){
            alert("Please use a valid email address!");
            return;
        }

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
                PositionFilters
                setTimeout(() => {
                    $('.modal').fadeToggle();

                }, 2500);
            },
            error: (jqXHR, textStatus, errorThrown) => {

            }
        });
    })

    $('#directory').on('click', '.deleteCell', (e) => {
        let parentInfo = $(e.target).parent().parent().children().toArray();
        tempDeleteID = parentInfo[0]['innerHTML'];
        tempFullName = parentInfo[2]['innerHTML'];

        PrepareDeleteForm();
        $('.modal').fadeToggle();
        $('#deleteCompleteSymbol').hide();
        $('#deleteModal').show();
        $('#deleteText').html(`Are you sure you would like to delete <strong>${tempFullName}</strong> from the directory?`);
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
                $('#submitLocation').hide(); 
                LocationFilters();
                $('#successModal').show();
                $('#successText').text("Location successfully added!");
                setTimeout(() => {
                    $('#successModal').hide()
                    $('#locationSettingsModal').show();
                }, 2500);
            }, error: (jqXHR, textStatus, errorThrown) => {

            }
        })
    })

    $('#dropDownArrow').on('click', () => {
        $('.filters').slideToggle();
        if($('#dropDownArrow').text() == "expand_more"){
            $('#dropDownArrow').text("expand_less");
        } else {
            $('#dropDownArrow').text("expand_more");
        }
    })

    $('#directory').on('click', '.infoIcon', (e) => {
        let parentInfo = $(e.target).parent().parent().children().toArray();
        HideModalFeatures();
        $('.modal').fadeToggle()
        $('.modal-title').text("Employee Info")
        $('#infoModal').show();
        let tempEmail = parentInfo[6]['innerText']; 
        const tagIndex = tempEmail.indexOf(' ');
        tempEmail = tempEmail.slice(tagIndex);

        $('#infoFN').html(parentInfo[3]['innerText']);
        $('#infoLN').html(parentInfo[4]['innerText']);
        $('#infoJP').html(parentInfo[5]['innerText']);
        $('#infoEM').html(tempEmail);
        $('#infoLO').html(parentInfo[7]['innerText']);
    })
    
    $("#positionFilter").on('change', () => {
        let data = getLJSON('directoryRows');
        let rowArray = [];
        for(let i = 0; i < data['data'].length; i++){
            if(data['data'][i]['jobTitle'] == $('#positionFilter').val()){
                rowArray.push(data['data'][i]);
            };
        }

        ClearDirectory();
        for(let i = 0; i < rowArray.length; i++) {
            var firstName = rowArray[i]['firstName'];
            var lastName = rowArray[i]['lastName'];
            var jobTitle = rowArray[i]['jobTitle'];
            var email = rowArray[i]['email'];
            var location = rowArray[i]['location'];
            var department = rowArray[i]['department'];
            var employeeID =  rowArray[i]['id']
            var fullName = firstName + " " + lastName;

            $('#directory').append(`<tr>
                <td id="eID">${employeeID}</td>
                <td id="inf"><i class="material-icons infoIcon" id=" ${employeeID}">info</i></td>
                <td id="fuN">${fullName}</td>
                <td id="fN">${firstName}</td>
                <td id="lN">${lastName}</td>
                <td id="jT">${jobTitle}</td>
                <td id="eM"><i class="material-icons emailButton">email</i> ${email}</td>
                <td id="lO">${location}</td>
                <td id="dE">${department}</td>
                <td class="buttonContainer"><i class="material-icons editButton editCell">edit</i></td>
                <td class="buttonContainer"><i class="material-icons deleteButton deleteCell">delete</i></td>
            </tr>`);
        }
    });

    main();
})
