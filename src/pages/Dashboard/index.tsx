import { useEffect, useState } from 'react';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { Header } from '../../components/Header';

export function Dashboard() {
  const [foods, setFoods] = useState<any[]>([]);
  const [editingFood, setEditingFood] = useState<any>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: any) {
    try {
      const response = await api.post('/foods', { ...food, available: true });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: any) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food });

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: any) {
    const oldFoods = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = oldFoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: any) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
