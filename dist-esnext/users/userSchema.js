import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, mutationWithClientMutationId } from 'graphql-relay';
function UserSchema({ userApp, log }) {
    const userType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
            id: { type: GraphQLString },
            userName: { type: GraphQLString },
            email: { type: GraphQLString },
            emailConfirmed: { type: GraphQLBoolean },
            displayName: { type: GraphQLString },
            imgUrl: { type: GraphQLString },
            // createdBy,
            // dtChanged,
            errors: { type: new GraphQLList(GraphQLString) }
        })
    });
    const userConnection = connectionDefinitions({
        name: 'User',
        nodeType: userType
    });
    function getUserConnection() {
        return {
            type: userConnection.connectionType,
            args: connectionArgs,
            resolve: (_, args, ctx) => {
                log('getting users');
                return connectionFromPromisedArray(userApp.find({
                    query: {},
                    options: { limit: args.first },
                    createdBy: ctx.createdBy
                }), args);
            }
        };
    }
    function getSaveUserMutation(outputViewer) {
        return mutationWithClientMutationId({
            name: 'SaveUser',
            inputFields: {
                id: { type: GraphQLString },
                userName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                displayName: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                errors: { type: new GraphQLList(GraphQLString) }
            },
            outputFields: {
                userEdge: {
                    type: userConnection.edgeType,
                    resolve: (user) => {
                        log('ql user', user);
                        return { node: user, cursor: user.id };
                    }
                },
                viewer: outputViewer
            },
            mutateAndGetPayload: async (userArgs, param2, param3) => {
                try {
                    log('saving user:', userArgs);
                    log('saving param2:', param2);
                    log('saving param3:', param3);
                    const savedUser = await userApp.save({
                        userArgs,
                        createdBy: null // TODO: FIX IT! SEND createdBy from context
                    });
                    log('saved user:', savedUser);
                    return savedUser;
                }
                catch (e) {
                    log('Error saving user:', e);
                }
            }
        });
    }
    function getAuthTokenMutation(outputViewer) {
        return mutationWithClientMutationId({
            name: 'GetAuthToken',
            inputFields: {
                userNameOrEmail: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            outputFields: {
                userEdge: {
                    type: userConnection.edgeType,
                    resolve: (authToken) => {
                        if (authToken.user == null)
                            return null;
                        return { node: authToken.user, cursor: authToken.user.id };
                    }
                },
                authToken: {
                    type: GraphQLString,
                    resolve: (authToken) => authToken.authToken
                },
                errors: {
                    type: new GraphQLList(GraphQLString),
                    resolve: (authToken) => authToken.errors
                },
                viewer: outputViewer
            },
            mutateAndGetPayload: async (form, param2, param3) => {
                try {
                    log('getAuthToken input:', form);
                    const authToken = await userApp.getAuthToken({
                        form,
                        createdBy: null // TODO: FIX IT! SEND createdBy from context
                    });
                    log('getAuthToken return:', authToken);
                    return authToken;
                }
                catch (e) {
                    log('Error saving user:', e);
                }
            }
        });
    }
    return {
        getSaveUserMutation,
        getUserConnection,
        getAuthTokenMutation
    };
}
export default UserSchema;
//# sourceMappingURL=userSchema.js.map