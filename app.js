import Sequelize from "sequelize";
const { DataTypes,Op } = Sequelize;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/database.sqlite",
});

sequelize.authenticate().then(() => {
    console.log('Connection successful')
  }).catch((err) => {
    console.log('Error connectiog to database')
  })

  const Student = sequelize.define('students', {
    student_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [2, 22]
        }
    },
    favourite_class:{
        type:DataTypes.STRING(25),
        defaultValue:"Computer Science"
    },
    school_year : {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    has_language_examination:{
        type: DataTypes.TINYINT,
        defaultValue:true
    }
});
Student.sync()
.then(()=>{
   /* Student.bulkCreate(
        [
            {
                name:"Teszt Elek",
                favourite_class : "Chemistry",
                school_year:12,
                has_language_examination:true
            },
            {
                name:"Jegy János",
                school_year:11,
                has_language_examination:false
            },
            {
                name:"Tóth Tamás",
                favourite_class : "Math",
                school_year:12,
                has_language_examination:false
            },
            {
                name:"Papp Zsolt",
                school_year:13,
                has_language_examination:true
            },
            {
                name:"Szabó Marcell",
                favourite_class : "Biology",
                school_year:13,
                has_language_examination:true
            },
        ]
    )*/

    Student.findAll(
        {
           where:
           {
            [Op.or]:{favourite_class:"Computer Science",has_language_examination:true}
           }
        }
    )
    .then((data) => {
		data.forEach((element) => {
      console.log(element.toJSON())
    })
	})
    Student.findAll(
        {
            attributes: [
                [sequelize.fn("COUNT", sequelize.col("name")), "num_students"],
                "school_year"
            ],
            group: "school_year",
        }
    ).then((data) => {
		data.forEach((element) => {
      console.log(element.toJSON())
    })
	})

})
