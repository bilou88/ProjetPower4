let notes = [12, 5, 18, 9, 14, 7, 20];

if (notes.length === 0) {
    console.log("Le tableau est vide !");
} else {
    let somme = 0;
    let nbAdmis = 0;

    for (let i = 0; i < notes.length; i++) {
        somme += notes[i];        // Ajouter la note à la somme
        if (notes[i] > 10) nbAdmis++; // Compter les notes > 10
    }

    console.log("Somme :", somme);
    console.log("Moyenne :", somme / notes.length);
    console.log("Nombre d'admis (>10) :", nbAdmis);
}