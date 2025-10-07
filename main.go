package main

import (
	"html/template"
	"log"
	"net/http"
)

// Charger le template
var tmpl = template.Must(template.ParseFiles("index.html"))
var tmplPower = template.Must(template.ParseFiles("power.html"))

func handler(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"Title": "Mon premier serveur Go",
		"Body":  "Ceci est une page HTML générée avec Go.",
	}
	err := tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
func handlerPower(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"Title": "Power 4",
		"Body":  "Bienvenue sur MAPAMOBI !",
	}
	err := tmplPower.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	http.Handle("/image/", http.StripPrefix("/image/", http.FileServer(http.Dir("image"))))
	http.Handle("/body.css", http.FileServer(http.Dir(".")))
	http.HandleFunc("/", handler)
	http.HandleFunc("/power.html", handlerPower)
	log.Println("Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
