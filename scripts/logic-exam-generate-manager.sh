#! /usr/bin/env bash

# 监测 logic-exam-generate node 进程是否运行中
# 1. 运行中，不做任何操作，休眠十分钟后重新开始监测
# 2. 已停止，将生成的文件挪到文件夹中保存，并重启 node 进程


is_node_process_alive() {
	[[ 2 = $( ps -e j | grep 'node ./spec/gen_output.js' | wc -l) ]]  && return 0
	return 1 # dead
}


handle_generated_files() {
	# make a new directory to save json and png 
	directory="$(date +%Y_%m_%d_%H_%M_%S)"
	mkdir $directory || exit 1 # 新建文件夹失败的异常

	# do second step & move files into directory
	node spec/gen_workable_exam_graph_after_verify.js
	mv workable_exam_after_verify/* $directory
	rm workable_exam_before_verify/* 
}


restart_node_process() {
	# restart node process in background
	nohup node ./spec/gen_output.js > /dev/null &
}



while true; do 
	if  ! is_node_process_alive ; then 
		handle_generated_files
		restart_node_process
	fi
	echo sleep  
	sleep 10m    # 控制休眠时间
done

