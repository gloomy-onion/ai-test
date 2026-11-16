import { GeolocationScreen } from '@/pages-fsd/geolocation';
import type { GetServerSideProps } from 'next';

// Пустой getServerSideProps переводит страницу в server-rendered: HTML рендерится
// на каждый запрос, поэтому nonce из middleware (x-nonce -> CSP script-src) всегда
// попадает в <script>-теги. Без этого страница отдаётся из кэша без nonce и CSP
// с 'strict-dynamic' блокирует все скрипты страницы.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

export default function GeolocationPage() {
  return <GeolocationScreen />;
}
