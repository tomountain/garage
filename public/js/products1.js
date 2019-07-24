Demo.Products = (function() {
  const init = function() {
    console.log('Products Page Initialize');
  };

  const getProducts = function() {
    // Rest Call
    Demo.Data.getFromServer(
      `${restUri}/${productPrefix}`,
      true,
      function(data) {
        const result = JSON.parse(data);
        console.log(result);

        let element = document.querySelector('#products-list');
        element.innerHTML = '';

        for (let i = 0; i < result.length; i++) {
          // Create row
          var child = document.createElement('tr');
          const sampleData = `
            <th scope="row">${result[i].id}</th>
            <td>${result[i].name}</td>
            <td>${result[i].description}</td>
            <td>${result[i].price}</td>
            <td>${result[i].createdAt}</td>
            <td>${result[i].updateAt}</td>`;
          child.innerHTML = sampleData;

          // append
          element.appendChild(child);
        }
      },
      function(error) {
        console.log(error);
      }
    );
  };

  const addProducts = function() {
    // Create Payload
    const payload = {
      name: '',
      description: '',
      price: 0,
    };

    payload.name = document.querySelector('#input-name').value;
    payload.description = document.querySelector('#input-description').value;
    payload.price = document.querySelector('#input-price').value;

    // Rest Call
    Demo.Data.sendToServer(
      `${restUri}/${productPrefix}`,
      'POST',
      payload,
      function(data) {
        const result = JSON.parse(data);
        console.log(result);
      },
      function(error) {
        console.log(error);
      }
    );
  };

  const deleteProducts = function() {
    const id = document.querySelector('#delete-id').value;

    // Rest Call
    Demo.Data.deleteFromServer(
      `${restUri}/${productPrefix}/${id}`,
      null,
      function(data) {
        console.log(data);
      },
      function(error) {
        console.log(error);
      }
    );
  };

  const updateProducts = function() {
    // Create Payload
    const id = document.querySelector('#update-id').value;
    const payload = {
      name: '',
      id: id,
      description: '',
      price: 0,
    };

    payload.name = document.querySelector('#update-name').value;
    payload.description = document.querySelector('#update-description').value;
    payload.price = document.querySelector('#update-price').value;

    // Rest Call
    Demo.Data.sendToServer(
      `${restUri}/${productPrefix}/${id}`,
      'PUT',
      payload,
      function(data) {
        const result = JSON.parse(data);
        console.log(result);
      },
      function(error) {
        console.log(error);
      }
    );
  };

  return {
    init: init,
    getProducts: getProducts,
    addProducts: addProducts,
    deleteProducts: deleteProducts,
    updateProducts: updateProducts,
  };
})();
