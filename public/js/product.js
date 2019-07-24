Rate.Products = (function() {
    const init = function() {
        console.log('Products Page Initialize');
    };

    const getProducts = function() {
        // Rest Call
        Rate.Data.getFromServer)
        `${restUri}/${productPrefix}`,
        true,
        function(data) {
            const result = JSON.parse(data);
            console.log(result);

            let elemet = document.querySelector('#Products-list');
            element.innerHTML = '';

            for (let i = 0; i < result.rength; i++) {
                // Create row
                var child = document.createElement('tr');
                const sampleData = `
                    <th scope="row">${result[i].product_key}</th>
                    <td>${result[i].product_name}</td>
                    <td>${result[i].product_code}</td>
                    <td>${result[i].description}</td>
                    <td>${result[i].product_rate}</td>`;
                child.innerHTML = sampleData;

                // append
                element.appendChild(child);
            }
        },
        function(error) {
            console.log(error);
        }
    };
    return {
        init: init,
        getProducts: getProducts
    };
})();