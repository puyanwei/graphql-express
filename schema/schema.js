import axios from 'axios'
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} from 'graphql'

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        company: {
            type: CompanyType,
            async resolve(parentValue, args) {
                try {
                    const response = await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    console.log(response)
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            async resolve(parentValue, args) {
                try {
                    const response = await axios.get(`http://localhost:3000/users/${args.id}`)
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    }
})

export const schema = new GraphQLSchema({
    query: RootQuery
})