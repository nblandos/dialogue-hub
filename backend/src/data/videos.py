menu_videos = [
    {"name": "Single Espresso"},
    {"name": "Double Espresso"},
    {"name": "Turkish Coffee"},
    {"name": "Americano"},
    {"name": "Decaf Coffee"},
    {"name": "Filter Coffee"},
    {"name": "Flat White"},
    {"name": "Cappuccino"},
    {"name": "Coffee Latte"},
    {"name": "Macchiato"},
    {"name": "Breakfast Tea"},
    {"name": "Earl Grey"},
    {"name": "Pepper Mint"},
    {"name": "Hot Chocolate"},
    {"name": "Chai Latte"},
    {"name": "Normal Milk"},
    {"name": "Skimmed Milk"},
    {"name": "Oat Milk"},
    {"name": "Soy Milk"},
    {"name": "Almond Milk"},
    {"name": "Coconut Milk"},
    {"name": "White Sugar"},
    {"name": "Brown Sugar"},
    {"name": "Sweetener"},
    {"name": "Chocolate Powder"},
    {"name": "Still Water"},
    {"name": "Sparkling Water"},
    {"name": "Lemonade Lime"},
    {"name": "Lemonade Blood Orange"},
    {"name": "Lemonade Ginger"},
    {"name": "Lemonade Passion Fruit"},
    {"name": "Kombucha Citro Hops"},
    {"name": "Kombucha Ginger&Hibiscus"},
    {"name": "Croissant"},
    {"name": "Almond Croissant"},
    {"name": "Pain Au Chocolat"},
    {"name": "Nutella Doughnut"},
    {"name": "Apricot Danish"},
    {"name": "Pain Aux Raisins"},
    {"name": "Cinnamon Bun"},
    {"name": "Chocolate&Custard Muffin"},
    {"name": "Plain Nata"},
    {"name": "Matcha&Raspberry Coconut Cookie"},
    {"name": "Salted Caramel Brownie"},
]

training_videos = [
    {"name": "Good morning"},
    {"name": "How are you?"},
    {"name": "Good evening"},
    {"name": "Hello"},
    {"name": "Hello-Please-Thank You"},
    {"name": "Please"},
    {"name": "Thank You"},
    {"name": "Change my mind"},
    {"name": "It's a lovely day"},
    {"name": "See you later"},
    {"name": "I'm fine"},
    {"name": "I don't like it"},
    {"name": "Do you like it?"},
    {"name": "Goodbye"},
    {"name": "Yes, I like it"},
]


def get_videos_by_category(category):
    if category == "menu":
        return menu_videos
    elif category == "training":
        return training_videos
    else:
        raise ValueError(f"Invalid category: {category}")
