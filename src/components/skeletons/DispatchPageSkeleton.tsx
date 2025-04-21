import React from "react";
import { Skeleton, Box, Grid, Divider } from "@mui/material";

const DispatchPageSkeleton: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
        <Skeleton variant="text" width="100%" height={40} />
      </div>

      <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">
        {/* Client Details Section */}
        <Box>
          <Box className="flex items-center w-full gap-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} height={30} />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Grid container spacing={2} className="mt-4">
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Box className="py-5">
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={150} height={30} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Ship To Details Section */}
        <Box>
          <Box className="flex items-center w-full gap-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} height={30} />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Grid container spacing={2} className="mt-4">
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Box className="py-5">
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={150} height={30} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Dispatch From Details Section */}
        <Box>
          <Box className="flex items-center w-full gap-3">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} height={30} />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Grid container spacing={2} className="mt-4">
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box className="py-5">
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={150} height={30} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Dispatch Details and Attachments Section */}
        <Box>
          <Box className="flex items-center w-full gap-3 pt-6">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={30} />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Grid container spacing={2} className="mt-4">
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box className="py-5">
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={150} height={30} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Form Fields Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
        </Grid>

        {/* File Upload and Remarks Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </div>

      {/* Footer Section */}
      <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px]">
        <Skeleton variant="rectangular" width={100} height={36} />
      </div>
    </div>
  );
};

export default DispatchPageSkeleton;
