import _ from 'lodash'
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} from 'graphql'

const users = [{
        id: '23',
        firstName: 'Ryu',
        age: 20
    },
    {
        id: '47',
        firstName: 'Ken',
        age: 25
    }
]

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
            resolve(parentValue, args) {
                return _.find(users, {
                    id: args.id
                })
            }
        }
    }
})

export const schema = new GraphQLSchema({
    query: RootQuery
})