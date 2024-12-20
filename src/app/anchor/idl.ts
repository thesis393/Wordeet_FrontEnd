export type WordeetContract = {
	"version": "0.1.0",
	"name": "wordeet_contract",
	"constants": [
		{
			"name": "USER_SEED",
			"type": "string",
			"value": "\"user\""
		},
		{
			"name": "POST_SEED",
			"type": "string",
			"value": "\"post\""
		}
	],
	"instructions": [
		{
			"name": "initialize",
			"accounts": [],
			"args": []
		},
		{
			"name": "createUserProfile",
			"accounts": [
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "author",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "systemProgram",
					"isMut": false,
					"isSigner": false
				}
			],
			"args": [
				{
					"name": "walletaddres",
					"type": "string"
				}
			]
		},
		{
			"name": "createBlogPost",
			"accounts": [
				{
					"name": "blogPost",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "author",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "owner",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "systemProgram",
					"isMut": false,
					"isSigner": false
				}
			],
			"args": [
				{
					"name": "coverimage",
					"type": "string"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "keywords",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
				},
				{
					"name": "status",
					"type": "string"
				},
				{
					"name": "bdelete",
					"type": "bool"
				},
				{
					"name": "nftcollectionaddress",
					"type": "string"
				},
				{
					"name": "ntotalcollecter",
					"type": "u32"
				}
			]
		},
		{
			"name": "editUserProfile",
			"accounts": [
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "owner",
					"isMut": true,
					"isSigner": true
				}
			],
			"args": [
				{
					"name": "avatar",
					"type": "string"
				},
				{
					"name": "username",
					"type": "string"
				},
				{
					"name": "twitterlink",
					"type": "string"
				},
				{
					"name": "externallink",
					"type": "string"
				},
				{
					"name": "bio",
					"type": "string"
				}
			]
		}
	],
	"accounts": [
		{
			"name": "userProfile",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "owner",
						"type": "publicKey"
					},
					{
						"name": "avatar",
						"type": "string"
					},
					{
						"name": "username",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "twitterlink",
						"type": "string"
					},
					{
						"name": "externallink",
						"type": "string"
					},
					{
						"name": "bio",
						"type": "string"
					},
					{
						"name": "postCount",
						"type": "u32"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "blogPost",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "owner",
						"type": "publicKey"
					},
					{
						"name": "coverimage",
						"type": "string"
					},
					{
						"name": "title",
						"type": "string"
					},
					{
						"name": "keywords",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "status",
						"type": "string"
					},
					{
						"name": "bdelete",
						"type": "bool"
					},
					{
						"name": "nftcollectionaddress",
						"type": "string"
					},
					{
						"name": "ntotalcollecter",
						"type": "u32"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		}
	],
	"errors": [
		{
			"code": 6000,
			"name": "UserProfileNotFound",
			"msg": "UserProfile does not exist."
		},
		{
			"code": 6001,
			"name": "BlogPostCreationFailed",
			"msg": "Blog post creation failed."
		},
		{
			"code": 6002,
			"name": "UserNameTooLong",
			"msg": "The name is too long"
		},
		{
			"code": 6003,
			"name": "UserBioTooLong",
			"msg": "The bio is too long"
		},
		{
			"code": 6004,
			"name": "TitleTooLong",
			"msg": "The title is too long"
		}
	]
};

export const IDL: WordeetContract = {
	"version": "0.1.0",
	"name": "wordeet_contract",
	"constants": [
		{
			"name": "USER_SEED",
			"type": "string",
			"value": "\"user\""
		},
		{
			"name": "POST_SEED",
			"type": "string",
			"value": "\"post\""
		}
	],
	"instructions": [
		{
			"name": "initialize",
			"accounts": [],
			"args": []
		},
		{
			"name": "createUserProfile",
			"accounts": [
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "author",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "systemProgram",
					"isMut": false,
					"isSigner": false
				}
			],
			"args": [
				{
					"name": "walletaddres",
					"type": "string"
				}
			]
		},
		{
			"name": "createBlogPost",
			"accounts": [
				{
					"name": "blogPost",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "author",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "owner",
					"isMut": true,
					"isSigner": true
				},
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "systemProgram",
					"isMut": false,
					"isSigner": false
				}
			],
			"args": [
				{
					"name": "coverimage",
					"type": "string"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "keywords",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
				},
				{
					"name": "status",
					"type": "string"
				},
				{
					"name": "bdelete",
					"type": "bool"
				},
				{
					"name": "nftcollectionaddress",
					"type": "string"
				},
				{
					"name": "ntotalcollecter",
					"type": "u32"
				}
			]
		},
		{
			"name": "editUserProfile",
			"accounts": [
				{
					"name": "userProfile",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "owner",
					"isMut": true,
					"isSigner": true
				}
			],
			"args": [
				{
					"name": "avatar",
					"type": "string"
				},
				{
					"name": "username",
					"type": "string"
				},
				{
					"name": "twitterlink",
					"type": "string"
				},
				{
					"name": "externallink",
					"type": "string"
				},
				{
					"name": "bio",
					"type": "string"
				}
			]
		}
	],
	"accounts": [
		{
			"name": "userProfile",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "owner",
						"type": "publicKey"
					},
					{
						"name": "avatar",
						"type": "string"
					},
					{
						"name": "username",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "twitterlink",
						"type": "string"
					},
					{
						"name": "externallink",
						"type": "string"
					},
					{
						"name": "bio",
						"type": "string"
					},
					{
						"name": "postCount",
						"type": "u32"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "blogPost",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "owner",
						"type": "publicKey"
					},
					{
						"name": "coverimage",
						"type": "string"
					},
					{
						"name": "title",
						"type": "string"
					},
					{
						"name": "keywords",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "status",
						"type": "string"
					},
					{
						"name": "bdelete",
						"type": "bool"
					},
					{
						"name": "nftcollectionaddress",
						"type": "string"
					},
					{
						"name": "ntotalcollecter",
						"type": "u32"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		}
	],
	"errors": [
		{
			"code": 6000,
			"name": "UserProfileNotFound",
			"msg": "UserProfile does not exist."
		},
		{
			"code": 6001,
			"name": "BlogPostCreationFailed",
			"msg": "Blog post creation failed."
		},
		{
			"code": 6002,
			"name": "UserNameTooLong",
			"msg": "The name is too long"
		},
		{
			"code": 6003,
			"name": "UserBioTooLong",
			"msg": "The bio is too long"
		},
		{
			"code": 6004,
			"name": "TitleTooLong",
			"msg": "The title is too long"
		}
	]
};
