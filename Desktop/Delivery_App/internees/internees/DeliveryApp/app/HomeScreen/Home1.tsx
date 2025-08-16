import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { IP_ADDRESS } from "@/constants/endpoint";

const Home1 = () => {
  const router = useRouter();
  // Fix: Tell TypeScript what type of data categories will hold
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple categories list if API fails
  const simpleCategories = [
    { category_id: 1, category_name: "Hamburger" },
    { category_id: 2, category_name: "Pizza" },
    { category_id: 3, category_name: "Noodles" },
    { category_id: 4, category_name: "Meat" },
    { category_id: 5, category_name: "Vegetable" },
    { category_id: 6, category_name: "Dessert" },
    { category_id: 7, category_name: "Drink" },
    { category_id: 8, category_name: "More" },
  ];

  // Get categories from server
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${IP_ADDRESS}/categories`);
      setCategories(response.data);
    } catch (error) {
      setCategories(simpleCategories);
    }
    setLoading(false);
  };

  // When user clicks a category
  const onCategoryPress = (category: any) => {
    const id = category.category_id.toString();
    const name = category.category_name;
    router.push(`/categories/${id}?name=${name}`);
  };

  // Cart button handler function (move outside getCategoryImage)
  const handleCartPress = () => {
    console.log("🛒 Cart button pressed!");
    // Navigate to cart screen
    router.push("/cart/cart"); // Adjust the path to your cart screen
  };

  // Get category image
  const getCategoryImage = (categoryName: string) => {
    const images: any = {
      Hamburger: require("../../assets/images/burger.png"),
      Pizza: require("../../assets/images/pizza.png"),
      Noodles: require("../../assets/images/noodles.png"),
      Meat: require("../../assets/images/meat.png"),
      Vegetable: require("../../assets/images/chinese-cabbage.png"),
      Dessert: require("../../assets/images/cake-slice.png"),
      Drink: require("../../assets/images/orange-juice.png"),
    };
    return images[categoryName] || require("../../assets/images/options.png");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Section */}
      {/* { uri: "https://randomuser.me/api/portraits/men/1.jpg" } */}
      <View style={styles.topBar}>
        <Image source={require("../../assets/images/jawadgull.jpeg")} style={styles.avatar} />
        <View style={styles.locationBox}>
          <Text style={styles.deliverText}>Deliver to</Text>
          <Text style={styles.locationText}>Blue Area,Islamabad</Text>
        </View>
        <View style={styles.iconBox}>
          <Image source={require("../../assets/images/bell.png")} style={styles.icon} />

          {/* <Image source={require("../../assets/images/cart.png")} style={styles.icon} /> */}
          <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
            <Image source={require("../../assets/images/cart.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Box */}
      <TextInput placeholder="What are you craving?" style={styles.searchBox} />

      {/* Special Offers */}
      <View style={styles.offerHeader}>
        <Text style={styles.title}>Special Offers</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {/* Discount Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bigText}>30%</Text>
          <Text style={styles.smallText}>DISCOUNT ONLY</Text>
          <Text style={styles.smallText}>VALID FOR TODAY!</Text>
        </View>
        <Image source={require("../../assets/images/burger_special.png")} style={styles.bannerImage} />
      </View>

      {/* Categories Grid */}
      <View style={styles.categoryGrid}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#37c667" />
            <Text>Loading...</Text>
          </View>
        ) : (
          categories.slice(0, 8).map((category: any) => (
            <TouchableOpacity
              key={category.category_id}
              style={styles.categoryBox}
              onPress={() => onCategoryPress(category)}
            >
              <Image source={getCategoryImage(category.category_name)} style={styles.categoryImage} />
              <Text style={styles.categoryName}>
                {category.category_name.length > 7
                  ? category.category_name.substring(0, 7) + ".."
                  : category.category_name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.bottomText}>Discount Guaranteed! 👌</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  locationBox: {
    flex: 1,
    paddingLeft: 10,
  },
  deliverText: {
    fontSize: 12,
    color: "gray",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconBox: {
    flexDirection: "row",
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 15,
    right: 20,
  },
  cartButton: {
    // padding: 5,
    marginLeft: 15,
  },
  searchBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    fontSize: 16,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#37c667",
    fontSize: 14,
    fontWeight: "600",
  },
  banner: {
    flexDirection: "row",
    height: 150,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: "#37c667",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bigText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  smallText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  bannerImage: {
    width: 120,
    height: 120,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
    justifyContent: "space-between",
  },
  categoryBox: {
    width: "22%",
    alignItems: "center",
    marginVertical: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 25,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default Home1;
