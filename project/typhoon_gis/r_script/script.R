library('rpart');
data_11 <- read.table('http://localhost:3000/api/getCSV', header=TRUE, sep=',');
data_00_rm <- c(
	"next_cent_pressure",
	"next_grade",
	"next_landfall_passage_indi",
	"next_max_sus_wind_spd",
	"next_max_wind_30kt_plus_radius",
	"next_max_wind_50kt_plus_radius",
	"next_min_wind_30kt_plus_radius",
	"next_min_wind_50kt_plus_radius",
	"next_month",
	"next_wind_dir_30kt_plus",
	"next_wind_dir_50kt_plus",
	"prev_cent_pressure",
	"prev_grade",
	"prev_lat",
	"prev_lon",
	"prev_landfall_passage_indi",
	"prev_max_sus_wind_spd",
	"prev_max_wind_30kt_plus_radius",
	"prev_max_wind_50kt_plus_radius",
	"prev_min_wind_30kt_plus_radius",
	"prev_min_wind_50kt_plus_radius",
	"prev_month",
	"prev_wind_dir_30kt_plus",
	"prev_wind_dir_50kt_plus"
);

data_01_rm <- c(
	"prev_cent_pressure",
	"prev_grade",
	"prev_lat",
	"prev_lon",
	"prev_landfall_passage_indi",
	"prev_max_sus_wind_spd",
	"prev_max_wind_30kt_plus_radius",
	"prev_max_wind_50kt_plus_radius",
	"prev_min_wind_30kt_plus_radius",
	"prev_min_wind_50kt_plus_radius",
	"prev_month",
	"prev_wind_dir_30kt_plus",
	"prev_wind_dir_50kt_plus"
);

data_10_rm <- c(
	"next_cent_pressure",
	"next_grade",
	"next_landfall_passage_indi",
	"next_max_sus_wind_spd",
	"next_max_wind_30kt_plus_radius",
	"next_max_wind_50kt_plus_radius",
	"next_min_wind_30kt_plus_radius",
	"next_min_wind_50kt_plus_radius",
	"next_month",
	"next_wind_dir_30kt_plus",
	"next_wind_dir_50kt_plus"
);

data_dist_rm <- c(
	"bearing",
	"next_lat",
	"next_lon"
);

data_bear_rm <- c(
	"distance",
	"next_lat",
	"next_lon"
);

data_lat_rm <- c(
	"distance",
	"bearing",
	"next_lon"
);

data_lon_rm <- c(
	"distance",
	"bearing",
	"next_lat"
);

data_00 <- data_11[,!(names(data_11) %in% data_00_rm)];
data_01 <- data_11[,!(names(data_11) %in% data_01_rm)];
data_10 <- data_11[,!(names(data_11) %in% data_10_rm)];

data_00_dist <- data_00[,!(names(data_00) %in% data_dist_rm)];
data_00_bear <- data_00[,!(names(data_00) %in% data_bear_rm)];
data_00_lat <- data_00[,!(names(data_00) %in% data_lat_rm)];
data_00_lon <- data_00[,!(names(data_00) %in% data_lon_rm)];

data_01_dist <- data_01[,!(names(data_01) %in% data_dist_rm)];
data_01_bear <- data_01[,!(names(data_01) %in% data_bear_rm)];
data_01_lat <- data_01[,!(names(data_01) %in% data_lat_rm)];
data_01_lon <- data_01[,!(names(data_01) %in% data_lon_rm)];

data_10_dist <- data_10[,!(names(data_10) %in% data_dist_rm)];
data_10_bear <- data_10[,!(names(data_10) %in% data_bear_rm)];
data_10_lat <- data_10[,!(names(data_10) %in% data_lat_rm)];
data_10_lon <- data_10[,!(names(data_10) %in% data_lon_rm)];

data_11_dist <- data_11[,!(names(data_11) %in% data_dist_rm)];
data_11_bear <- data_11[,!(names(data_11) %in% data_bear_rm)];
data_11_lat <- data_11[,!(names(data_11) %in% data_lat_rm)];
data_11_lon <- data_11[,!(names(data_11) %in% data_lon_rm)];

tree_00_dist <- rpart(distance~., method='anova', data=data_00_dist);
save(tree_00_dist, file='/project/typhoon_gis/r_tree/tree_00_dist.rda');
tree_00_bear <- rpart(distance~., method='anova', data=data_00_bear);
save(tree_00_bear, file='/project/typhoon_gis/r_tree/tree_00_bear.rda');
tree_00_lat <- rpart(distance~., method='anova', data=data_00_lat);
save(tree_00_lat, file='/project/typhoon_gis/r_tree/tree_00_lat.rda');
tree_00_lon <- rpart(distance~., method='anova', data=data_00_lon);
save(tree_00_lon, file='/project/typhoon_gis/r_tree/tree_00_lon.rda');
tree_01_dist <- rpart(distance~., method='anova', data=data_01_dist);
save(tree_01_dist, file='/project/typhoon_gis/r_tree/tree_01_dist.rda');
tree_01_bear <- rpart(distance~., method='anova', data=data_01_bear);
save(tree_01_bear, file='/project/typhoon_gis/r_tree/tree_01_bear.rda');
tree_01_lat <- rpart(distance~., method='anova', data=data_01_lat);
save(tree_01_lat, file='/project/typhoon_gis/r_tree/tree_01_lat.rda');
tree_01_lon <- rpart(distance~., method='anova', data=data_01_lon);
save(tree_01_lon, file='/project/typhoon_gis/r_tree/tree_01_lon.rda');
tree_10_dist <- rpart(distance~., method='anova', data=data_10_dist);
save(tree_10_dist, file='/project/typhoon_gis/r_tree/tree_10_dist.rda');
tree_10_bear <- rpart(distance~., method='anova', data=data_10_bear);
save(tree_10_bear, file='/project/typhoon_gis/r_tree/tree_10_bear.rda');
tree_10_lat <- rpart(distance~., method='anova', data=data_10_lat);
save(tree_10_lat, file='/project/typhoon_gis/r_tree/tree_10_lat.rda');
tree_10_lon <- rpart(distance~., method='anova', data=data_10_lon);
save(tree_10_lon, file='/project/typhoon_gis/r_tree/tree_10_lon.rda');
tree_11_dist <- rpart(distance~., method='anova', data=data_11_dist);
save(tree_11_dist, file='/project/typhoon_gis/r_tree/tree_11_dist.rda');
tree_11_bear <- rpart(distance~., method='anova', data=data_11_bear);
save(tree_11_bear, file='/project/typhoon_gis/r_tree/tree_11_bear.rda');
tree_11_lat <- rpart(distance~., method='anova', data=data_11_lat);
save(tree_11_lat, file='/project/typhoon_gis/r_tree/tree_11_lat.rda');
tree_11_lon <- rpart(distance~., method='anova', data=data_11_lon);
save(tree_11_lon, file='/project/typhoon_gis/r_tree/tree_11_lon.rda');
