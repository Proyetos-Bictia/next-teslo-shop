import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';

import { SummaryTitle } from '../../comoponents/admin';
import { AdminLayout } from '../../comoponents/layouts';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000
  });
  const [refresIn, setRefresIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
      setRefresIn((refresIn) => refresIn > 0 ? refresIn - 1 : 30)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  

  if (!error && !data) {
    return <>Loading...</>
  }

  if (error) {
    console.log(error);
    return <>Error al cargar la información</>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventary,
    lowInventory
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subtitle='Estadisticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          title={numberOfOrders}
          subTitle='Ordenes totales'
          icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={paidOrders}
          subTitle='Ordenes pagadas'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={notPaidOrders}
          subTitle='Ordenes no pagadas'
          icon={<AttachMoneyOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfClients}
          subTitle='Clientes'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={numberOfProducts}
          subTitle='Productos'
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={productsWithNoInventary}
          subTitle='Sin existencias'
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={lowInventory}
          subTitle='Bajo inventario'
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTitle
          title={refresIn}
          subTitle='Actualización en:'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage;
