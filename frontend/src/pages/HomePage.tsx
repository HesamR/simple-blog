import { useEffect } from 'react';
import { getAllArticles } from '../api/api';
import usePromise from '../hooks/usePromise';
import { Box, Group } from '@mantine/core';
import ArticleCard from '../components/ArticleCard';

function HomePage() {
  const getArticlePromise = usePromise({
    promiseFn: getAllArticles,
    onSuccess(out) {
      const users = new Set();
      out.forEach(({ userId }) => {
        users.add(userId);
      });
    },
  });

  useEffect(() => {
    getArticlePromise.call();
  }, []);

  return (
    <Box>
      {getArticlePromise.isSuccess && (
        <Group wrap='wrap' grow>
          {getArticlePromise.output?.map((value) => (
            <ArticleCard article={value} key={value.id} />
          ))}
        </Group>
      )}
    </Box>
  );
}

export default HomePage;
