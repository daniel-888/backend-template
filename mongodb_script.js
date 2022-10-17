db.createUser({
  user: "Mike",
  pwd: "fishtest",
  roles: [{role: "userAdminAnyDatabase", db:"admin"}, "readWriteAnyDatabase"]
  }
)