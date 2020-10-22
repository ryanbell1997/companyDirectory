$(document).ready(() => {
    //Reset Event
    $(".resetText").on('click', () => {
        $(".filterSelect").val("");
    });

    $("#departmentFilter").on('change', () => {
        if($("departmentFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/departmentFilter.php",
                method: "POST",
                data: {
                    department: $("#departmentFilter").val()
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

    $("#locationFilter").on('change', () => {
        if($("locationFilter").val() == ""){
            return;
        } else {
            $.ajax({
                url: "libs/php/locationFilter.php",
                method: "POST",
                data: {
                    department: $("#locationFilter").val()
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

});
