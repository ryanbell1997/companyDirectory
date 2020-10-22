$.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    data: {},
        success: (result) => {
        console.log(result);
        for(let i = 0; i < result['data'].length; i++){
            var row = `
             <tr>
                <td>${result['data'][i]['firstName']}</td>
                <td>${result['data'][i]['lastName']}</td>
                <td>${result['data'][i]['jobTitle']}</td>
                <td>${result['data'][i]['email']}</td>
                <td>${result['data'][i]['location']}</td>
                <td>${result['data'][i]['department']}</td>
                <td>null</td>
            </tr>
            `;

            $('#directory').append(row);
        }
    }, error: (jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        console.log("hello");
    }
})