module.exports = {
  // Load Mock Product Data Into localStorage
  init: function() {
    localStorage.clear();
    localStorage.setItem('product', JSON.stringify([
      {
        id: '0011001',
        name: 'Sample item',
        image: 'item.png',
        description: 'Sample Copy',
        variants: [
          {
            sku: '123123',
            type: 'Type 1',
            price: 10,
            inventory: 1
          },
          {
            sku: '123124',
            type: 'Type 2',
            price: 30.99,
            inventory: 5
          },
          {
            sku: '1231235',
            type: 'Type 3',
            price: 59.99,
            inventory: 3
          }
        ]
      }
    ]));
  }

};