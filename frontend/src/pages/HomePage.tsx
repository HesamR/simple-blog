import { useQuery } from '@tanstack/react-query';
import { Box, Group } from '@mantine/core';

import { getAllArticles } from '../api/api';
import ArticleCard from '../components/ArticleCard';
import LoadFallback from '../components/LoadFallback';

function HomePage() {
  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ['get-all-articles'],
    queryFn: getAllArticles,
  });

  return (
    <Box>
      {isPending && <LoadFallback />}
      {isError && <p>Failed to get articles</p>}
      {isSuccess && (
        <Group wrap='wrap' grow justify='center'>
          {data.map((value) => (
            <ArticleCard article={value} key={value.id} />
          ))}
        </Group>
      )}
    </Box>
  );
}

export default HomePage;
