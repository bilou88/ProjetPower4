package main

import (
	"html/template"
	"log"
	"net/http"
)

// Charger le template
var tmpl = template.Must(template.ParseFiles("index.html"))

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

func main() {
	http.HandleFunc("/", handler)
	log.Println("Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

