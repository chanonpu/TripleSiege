package com.humber.CardGame.controllers;

import com.humber.CardGame.services.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/decks")
public class DeckController {
    @Autowired
    private DeckService deckService;

    @PostMapping("/newDeck")
    public ResponseEntity<String> createDeck(Principal principal, @RequestParam(required = false) String deckName) {
        String username = principal.getName();
        if (deckName == null) deckName = "New Deck";
        deckService.createNewDeck(username, deckName);
        return ResponseEntity.ok("Deck \"" + deckName + "\" created successfully");
    }

    //add card to deck
    @PutMapping("/addDeck/{deckId}/{cardId}")
    public ResponseEntity<String> AddCardToDeck(Principal principal, @PathVariable String cardId, @PathVariable String deckId) {
        String username = principal.getName(); // get username from jwt token
        deckService.addCardToDeck(username, cardId, deckId);
        return ResponseEntity.ok("Card added successfully");
    }

    //remove card from deck
    @DeleteMapping("/removeDeck/{deckId}/{cardId}")
    public ResponseEntity<String> RemoveCardFromDeck(Principal principal, @PathVariable String cardId, @PathVariable String deckId) {
        String username = principal.getName();
        deckService.removeCardFromDeck(username, cardId, deckId);
        return ResponseEntity.ok("Card removed successfully");
    }

    //delete deck
    @DeleteMapping("/deleteDeck/{deckId}")
    public ResponseEntity<String> deleteDeck(Principal principal, @PathVariable String deckId) {
        String username = principal.getName();
        deckService.deleteDeck(username, deckId);
        return ResponseEntity.ok("Deck deleted successfully");
    }
}
