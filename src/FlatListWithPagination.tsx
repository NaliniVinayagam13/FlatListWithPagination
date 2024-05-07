import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import axios from 'axios';

interface Item {
  id: number;
  title: string;
}

const FlatListWithPg: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('fetch data -- pg: ', page);
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=20`);
      const newData: Item[] = await response.data;

      setData(prevData => [...prevData, ...newData]);
      setPage(page + 1);
      setLoading(false);
      if (newData.length > 0) {
        setHasMore(true);
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const renderFooter = () => {
    return loading ? (
      <View style={styles.paddingTwenty}>
        <ActivityIndicator animating size="large" />
      </View>
    ) : null;
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.rowStlye}>
      <Text style={styles.itemStyle}>{item.id}.</Text>
      <Text style={styles.itemStyle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <Text style={styles.titleStyle}> FlatList With Pagination</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          console.log('page: ', page, ' -- hasMore: ', hasMore);
          if (hasMore) {
            fetchData();
          }
        }
        }
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  itemStyle: {
    color: 'white',
    fontSize: 14,
    margin: 5,
  },
  paddingTwenty: {
    padding: 20,
  },
  rowStlye: {
    padding: 20,
    flexDirection: 'row',
  }

})

export default FlatListWithPg;
