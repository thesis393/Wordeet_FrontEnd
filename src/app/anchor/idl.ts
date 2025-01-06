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
					"name": "content",
					"type": "string"
				},
				{
					"name": "category",
					"type": "string"
				},
				{
					"name": "keywords",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
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
		},
		{
			"name": "editBlogPost",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "nftcollectionaddress",
					"type": "string"
				},
				{
					"name": "ntotalcollecter",
					"type": "u8"
				},
				{
					"name": "upvote",
					"type": "u32"
				},
				{
					"name": "downvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "addCollector",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "collectorInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "collector",
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
					"name": "username",
					"type": "string"
				},
				{
					"name": "avatar",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
				},
				{
					"name": "nftMintAddress",
					"type": "string"
				}
			]
		},
		{
			"name": "editBlogNftcollectionaddress",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "nftcollectionaddress",
					"type": "string"
				}
			]
		},
		{
			"name": "editBlogNtotalcollecter",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "ntotalcollecter",
					"type": "u8"
				}
			]
		},
		{
			"name": "editBlogUpvote",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "upvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "editBlogDownvote",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "downvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "addVote",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voteInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voter",
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
					"name": "status",
					"type": "u8"
				}
			]
		},
		{
			"name": "editVote",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voteInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voter",
					"isMut": true,
					"isSigner": true
				}
			],
			"args": [
				{
					"name": "status",
					"type": "u8"
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
						"type": "u8"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "collectorInfo",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "blogPost",
						"type": "publicKey"
					},
					{
						"name": "collector",
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
						"name": "id",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "nftMintAddress",
						"type": "string"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "voteInfo",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "blogPost",
						"type": "publicKey"
					},
					{
						"name": "voter",
						"type": "publicKey"
					},
					{
						"name": "status",
						"type": "u8"
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
						"name": "content",
						"type": "string"
					},
					{
						"name": "category",
						"type": "string"
					},
					{
						"name": "upvote",
						"type": "u32"
					},
					{
						"name": "downvote",
						"type": "u32"
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
						"type": "i32"
					},
					{
						"name": "nftcollectionaddress",
						"type": "string"
					},
					{
						"name": "ntotalcollecter",
						"type": "u8"
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
		},
		{
			"code": 6005,
			"name": "NFTCollectionAddressNull",
			"msg": "The nftcollectionaddress is null"
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
					"name": "content",
					"type": "string"
				},
				{
					"name": "category",
					"type": "string"
				},
				{
					"name": "keywords",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
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
		},
		{
			"name": "editBlogPost",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "nftcollectionaddress",
					"type": "string"
				},
				{
					"name": "ntotalcollecter",
					"type": "u8"
				},
				{
					"name": "upvote",
					"type": "u32"
				},
				{
					"name": "downvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "addCollector",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "collectorInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "collector",
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
					"name": "username",
					"type": "string"
				},
				{
					"name": "avatar",
					"type": "string"
				},
				{
					"name": "walletaddress",
					"type": "string"
				},
				{
					"name": "nftMintAddress",
					"type": "string"
				}
			]
		},
		{
			"name": "editBlogNftcollectionaddress",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "nftcollectionaddress",
					"type": "string"
				}
			]
		},
		{
			"name": "editBlogNtotalcollecter",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "ntotalcollecter",
					"type": "u8"
				}
			]
		},
		{
			"name": "editBlogUpvote",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "upvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "editBlogDownvote",
			"accounts": [
				{
					"name": "blogPost",
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
					"name": "downvote",
					"type": "u32"
				}
			]
		},
		{
			"name": "addVote",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voteInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voter",
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
					"name": "status",
					"type": "u8"
				}
			]
		},
		{
			"name": "editVote",
			"accounts": [
				{
					"name": "postAccount",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voteInfo",
					"isMut": true,
					"isSigner": false
				},
				{
					"name": "voter",
					"isMut": true,
					"isSigner": true
				}
			],
			"args": [
				{
					"name": "status",
					"type": "u8"
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
						"type": "u8"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "collectorInfo",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "blogPost",
						"type": "publicKey"
					},
					{
						"name": "collector",
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
						"name": "id",
						"type": "string"
					},
					{
						"name": "walletaddress",
						"type": "string"
					},
					{
						"name": "nftMintAddress",
						"type": "string"
					},
					{
						"name": "createdAt",
						"type": "i64"
					}
				]
			}
		},
		{
			"name": "voteInfo",
			"type": {
				"kind": "struct",
				"fields": [
					{
						"name": "blogPost",
						"type": "publicKey"
					},
					{
						"name": "voter",
						"type": "publicKey"
					},
					{
						"name": "status",
						"type": "u8"
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
						"name": "content",
						"type": "string"
					},
					{
						"name": "category",
						"type": "string"
					},
					{
						"name": "upvote",
						"type": "u32"
					},
					{
						"name": "downvote",
						"type": "u32"
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
						"type": "i32"
					},
					{
						"name": "nftcollectionaddress",
						"type": "string"
					},
					{
						"name": "ntotalcollecter",
						"type": "u8"
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
		},
		{
			"code": 6005,
			"name": "NFTCollectionAddressNull",
			"msg": "The nftcollectionaddress is null"
		}
	]
};
