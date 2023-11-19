function createGovernmentMethods(app: any) {
    app.post('/gov/createGovernment', (req, res) => {
        try{
          console.log('creating government ')
      
          const { uuid, name, description, imageUrl } = req.body
      
          const sql = `INSERT INTO government (uuid, name, description, imageUrl) values (?, ?, ?, ?)` 
          
          db.run(sql, [uuid, name, description, imageUrl], (err) => {
            if (err){
              return res.json({status: 300, success: false, error: err})
            }
      
            console.log('created government', uuid, name, description, imageUrl)
          })
      
          return res.json({
            status: 200,
            success: true
          })
        }catch(err){
          console.log('failed to create government', err)
      
          return res.json({
            status: 400,
            success: false,
            error: err
          })
        }
      });
 

    
  }