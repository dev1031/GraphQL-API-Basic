const _ = require('lodash')
const jwt = require('jsonwebtoken');
const { GraphQLObjectType , GraphQLInt , GraphQLString, GraphQLNonNull , GraphQLSchema , GraphQLList } = require('graphql')
const Book = require('./../models/books');
const User  = require('./../models/user')

const employees = [
    {
        id: 1,
        name: 'example',
        email: 'example@appdividend.com'
    },
    {
        id: 2,
        name: 'test',
        email: 'test@appdividend.com'
    },
    {
        id: 3,
        name: 'test_example',
        email: 'test_example@appdividend.com'
    }];

const books =[
    {
        id:1,
        name: 'The dance of Dragon',
        author: 'R.R. Martin' 
    },
    {
        id:2,
        name:'Fantastic Beast and Where to Find Them',
        author:'J.K. Rolling'
    },
    {
        id:3,
        name : 'Lord of the Ring:The Two Towers',
        author: 'R.R.Tolkings'
    }
]    

const EmployeeType  = new GraphQLObjectType({
    name : 'Employee',
    fields:()=>({
        id : { type : GraphQLInt },
        name : { type : GraphQLString },
        email : { type : GraphQLString }
    }) 
})

const BookType = new GraphQLObjectType({
    name : 'Book',
    fields:()=>({
        id : {type : GraphQLInt},
        name : {type : GraphQLString},
        author : { type : GraphQLString }
    })
})

const UserType =new GraphQLObjectType({
    name: 'User',
    fields: ()=>({
        username : {type : GraphQLString},
        email : {type : GraphQLString },
        password : {type : GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve(){
                return employees
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(){
                return books
            }
        },
        book:{
            type : BookType,
            args : {id:{type : GraphQLInt }},
            resolve(parent , args){
                return _.find(books , {id :args.id})
            }
        },
        employee:{
            type: EmployeeType,
            args:{id:{type:GraphQLInt}},
            resolve(parent , args){
                return _.find(employees, {id :args.id})
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields:{
        addBook :{
            type : BookType,
            args :{
                name : { type :  new GraphQLNonNull(GraphQLString) },
                author :{ type :  new GraphQLNonNull(GraphQLString) },
                id : { type :  new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent , args ){
                let book = new Book({
                    name : args.name,
                    author: args.author,
                    id : args.id
                });
                 book.save()
                return book
            }
        },
        addUser :{
            type : UserType,
            args:{
                username : { type: new GraphQLNonNull(GraphQLString)},
                email : {type : new GraphQLNonNull(GraphQLString)},
                password : { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent , args ){
                let user = new User({
                    username : args.username,
                     email : args.email,
                     password: args.password
                });
                let token  = jwt.sign({user : user} ,'MY_JWT_SECERET' , { expiresIn : '1d'})
                user.save()
                //console.log(token)
                return user
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation : Mutation
});