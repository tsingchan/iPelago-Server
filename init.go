package main

import (
	"flag"
	"net/http"

	"microblog/database"
	"microblog/model"
	"microblog/util"
)

const (
	OK = http.StatusOK
)

const (
	dbFileName = "micro_server.db"
)

type (
	Island     = model.Island
	Newsletter = model.Newsletter
)

var secretKey []byte

var (
	db   = new(database.DB)
	addr = flag.String("addr", "127.0.0.1:9900", "IP address of the server")
	demo = flag.Bool("demo", false, "set this flag for demo")
)

func init() {
	flag.Parse()
	util.Panic(db.Open(dbFileName))
	util.Panic(initSecretKey())
}

func initSecretKey() (err error) {
	secretKey, err = db.GetSecretKey()
	return
}
