import axios from 'axios'
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
} from 'graphql'

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parentValue, args) {
                try {
                    const response = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
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
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    })
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
        },
        company: {
            type: CompanyType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            async resolve(parentValue, args) {
                try {
                    const response = await axios.get(`http://localhost:3000/companies/${args.id}`)
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: GraphQLInt
                },
                companyId: {
                    type: GraphQLString
                }
            },
            async resolve(parentValue, {
                firstName,
                age,
                companyId
            }) {
                try {
                    const response = await axios.post('http://localhost:3000/users', {
                        firstName,
                        age
                    })
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            async resolve(parentValue, {
                id
            }) {
                try {
                    const response = await axios.delete(`http://localhost:3000/users/${id}`)
                    return response.data
                } catch (error) {
                    return console.log(error)
                }
            }
        }
    }
})

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
})