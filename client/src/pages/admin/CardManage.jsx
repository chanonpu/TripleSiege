import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import CardEditForm from './CardEditForm';

const CardManage = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${SERVER_URL}/admin/test`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (err) {
                alert("You don't have permission");
                navigate('/');
            }
        };

        checkAuth();
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/card/allCards`);
            setCards(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cards');
            setLoading(false);
        }
    };

    const handleEdit = (card) => {
        setSelectedCard(card);
    };

    const handleDelete = async (cardId) => {
        try {
            console.log(`Attempting to delete card with ID: ${cardId}`);
            const response = await axios.delete(`${SERVER_URL}/admin/deleteCard/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Delete response:', response.data);
            fetchCards(); // Refresh the cards list
            alert('Card deleted successfully');
        } catch (err) {
            console.error('Delete error:', err.response ? err.response.data : err.message);
            alert(`Failed to delete card: ${err.response ? err.response.data : err.message}`);
        }
    };

    const addCardForAdmin = async () => {
        try {
            const response = await axios.put(`${SERVER_URL}/admin/addAllCard`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            alert('All Card added')
        } catch (err) {
            console.error('Add all card error:', err.response ? err.response.data : err.message);
            alert(`Failed to add all card: ${err.response ? err.response.data : err.message}`);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Card Management</h1>

            {selectedCard ? (
                <CardEditForm
                    card={selectedCard}
                    onCancel={() => setSelectedCard(null)}
                    onSave={() => {
                        setSelectedCard(null);
                        fetchCards();
                    }}
                />
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedCard({
                            name: '',
                            abilityText: '',
                            colour: '',
                            power: 0,
                            image: '',
                            imageData: null,
                            imageType: ''
                        })}
                        className="btn btn-dark m-3"
                    >
                        Add New Card
                    </button>

                    <button
                        onClick={addCardForAdmin}
                        className="btn btn-success m-3"
                    >
                        Add All Card to your card list
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="border rounded-lg p-4 shadow">

                                <img
                                    src={`http://localhost:8080/card/image/${card.id}`}
                                    alt={card.name}
                                    height={'200px'}
                                />

                                <h3 className="font-bold text-lg">{card.name}</h3>
                                <p className="text-gray-600">{card.abilityText}</p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm">Power: {card.power}</span>
                                    <span className="text-sm">Color: {card.colour}</span>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        onClick={() => handleEdit(card)}
                                        className="btn btn-warning mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardManage;